/* eslint-disable */
// @ts-ignore
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const isWindow = os.platform().startsWith('win');
const defaultLocale = 'zh-CN';
// 定义系统支持的所有语言环境对应的 locales
const locales = [defaultLocale, 'en-US'];
const tempFolder = path.join(__dirname, './src/temp');
// 临时提取有关 intel 的所有 json 配置文件（只是临时使用，所以将会被删除）
const filePath = path.join('./src/temp/extractLocale.json');
const extractTempFile = isWindow ? filePath.replace(/\\/g, '/') : filePath;

/**
 * 合并两个JSON文件，更新目标JSON文件
 * @param {string} targetPath - 目标JSON文件路径（需要更新的文件）
 * @param {string} sourcePath - 源JSON文件路径（将被合并的文件）
 */
const mergeJsonFiles = (
  targetPath: string,
  sourcePath: string,
  locale: string,
) => {
  try {
    // 读取两个JSON文件
    let dataTarget = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
    const dataSource = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

    // 如果目标JSON文件不存在，则创建一个空对象
    if (!dataTarget) {
      dataTarget = {};
    }

    const needTransitionObj: Record<string, string> = {};

    // 遍历源JSON文件的所有键值对
    for (const key in dataSource) {
      if (Object.prototype.hasOwnProperty.call(dataSource, key)) {
        // 如果目标JSON文件中存在该键且有值，则保留当前的键和值
        if (
          Object.prototype.hasOwnProperty.call(dataTarget, key) &&
          dataSource[key]
        ) {
          continue;
        }
        // 如果目标JSON文件中不存在该键，则添加该键
        else if (!Object.prototype.hasOwnProperty.call(dataTarget, key)) {
          needTransitionObj[key] = dataSource[key];
          dataTarget[key] = targetPath.includes(defaultLocale)
            ? dataSource[key]
            : key;
        }
        // 如果目标 json 中存在 key，但是源（临时文件） json 中不存在该 key，则删除该键
        else if (!dataSource[key] && dataTarget[key]) {
          delete dataTarget[key];
        }
      }
    }

    if (locale !== defaultLocale) {
      console.log(
        '你需要使用 gpt 将: ',
        JSON.stringify(needTransitionObj, null, 2),
        `\n\n 翻译为 ${locale} 语言并 放在 src/locales/${locale}.json 文件中`,
      );
    }

    // 将更新后的对象写回到目标JSON文件
    fs.writeFileSync(targetPath, JSON.stringify(dataTarget, null, 2), 'utf8');
  } catch (error) {
    console.error('merge json files error', error);
  }
};

// 提取有关 intel 的所有 json
const extractMessages = () => {
  execSync(
    `npx formatjs extract "src/**/*.tsx" --out-file ${extractTempFile}`,
    (error: Error, _stdout: any, stderr: any) => {
      if (error) {
        return;
      }

      if (stderr) {
        console.error(`提取消息的错误: ${stderr}`);
      }
    },
  );
};

const removeFolder = (folder: string) => {
  if (fs.existsSync(folder)) {
    fs.rm(
      folder,
      {
        recursive: true,
        force: true,
      },
      (error: Error) => {
        if (error) {
          console.error('删除临时文件错误，请手动删除');
        }
      },
    );
  }
};

// 编译提取的临时文件，并生成对应语言环境的 json
const compileMessages = (locale: string) => {
  const filePath = path.join('./src/temp', `${locale}.json`);
  const tempLocaleFile = isWindow ? filePath.replace(/\\/g, '/') : filePath;

  execSync(
    `npx formatjs compile ${extractTempFile} --out-file ${tempLocaleFile}`,
    (error: Error) => {
      if (error) {
        console.error(`编译临时文件错误: ${error}`);
      }
    },
  );

  const localesFolder = path.join('./src/locales');
  const localeFilePath = path.join(
    __dirname,
    './src/locales',
    `${locale}.json`,
  );
  console.log('localeFilePath: ', localeFilePath);

  if (!fs.existsSync(localeFilePath)) {
    fs.mkdirSync(localesFolder, { recursive: true });
    fs.writeFileSync(localeFilePath, '{}', {
      flag: 'w',
      encoding: 'utf8',
      mode: 0o777,
    });
  }
  // Optimize: 引入 LLM 优化根据 locale 生成对应语言环境的 json
  const targetLocaleFile = path.join('./src/locales', `${locale}.json`);
  mergeJsonFiles(targetLocaleFile, tempLocaleFile, locale);
};

// 主函数
function genI18n() {
  try {
    extractMessages();

    for (const locale of locales) {
      compileMessages(locale);
    }

    removeFolder(tempFolder);
    console.log('所有消息提取和编译完成');
  } catch (error) {
    console.error(error);
  }
}

genI18n();
