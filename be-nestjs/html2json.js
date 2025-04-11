const cheerio = require('cheerio');

function html2json({ html }) {
  const $ = cheerio.load(html);
  const results = new Set();

  // 通用解析逻辑
  const commonParse = () => {
    // 1. 解析 <img> 标签
    $('img').each((_, el) => {
      const $img = $(el);
      addUrl($img.attr('src'));
      parseSrcset($img.attr('srcset'));
    });

    // 2. 解析 <picture> 中的 <source>
    $('picture source').each((_, el) => {
      parseSrcset($(el).attr('srcset'));
    });

    // 3. 解析 CSS 背景图
    $('[style]').each((_, el) => {
      const bg = $(el).css('background-image');
      const url = bg?.match(/url\(["']?(.*?)["']?\)/)?.[1];
      addUrl(url);
    });

    // 增强的 CSS 背景图解析
    const parseBackgroundImage = (styleAttr) => {
      // 处理包含空格和非标准写法的 background-image
      const bgMatch = styleAttr.match(
        /background\s*-\s*image\s*:\s*url\(["']?(.*?)["']?\)/i,
      );
      return bgMatch ? bgMatch[1] : null;
    };

    // 修改后的 CSS 背景图解析
    $('[style]').each((_, el) => {
      const styleAttr = $(el).attr('style') || '';
      const url = parseBackgroundImage(styleAttr);
      addUrl(url);
    });
    // 4. 解析 meta 标签
    [
      'meta[property="og:image"]',
      'meta[name="twitter:image"]',
      'meta[itemprop="image"]',
    ].forEach((selector) => {
      addUrl($(selector).attr('content'));
    });

    // 5. 解析 JSON-LD
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const data = JSON.parse($(el).html());
        if (data?.image) {
          if (Array.isArray(data.image)) {
            data.image.forEach((url) => addUrl(url));
          } else {
            addUrl(data.image);
          }
        }
      } catch (e) {
        /* 忽略错误 */
      }
    });

    // 6. 解析其他资源标签
    ['a[href]', 'object[data]', 'embed[src]', 'video[poster]'].forEach(
      (selector) => {
        $(selector).each((_, el) => {
          const $el = $(el);
          const attr = selector.includes('a')
            ? 'href'
            : selector.includes('object')
              ? 'data'
              : selector.includes('embed')
                ? 'src'
                : 'poster';
          const url = $el.attr(attr);
          if (isImageUrl(url)) addUrl(url);
        });
      },
    );
  };

  // 辅助方法
  const parseSrcset = (srcset) => {
    if (!srcset) return;
    srcset.split(',').forEach((entry) => {
      const url = entry.trim().split(/\s+/)[0];
      addUrl(url);
    });
  };

  const addUrl = (url) => {
    if (url && isImageUrl(url)) {
      results.add(url.trim());
    }
  };

  const isImageUrl = (url) => {
    return /\.(jpe?g|png|gif|webp|svg|bmp|ico)(\?.*)?$/i.test(url);
  };

  // 执行解析
  commonParse();

  // 返回格式化结果
  return {
    imgs: Array.from(results).map((link) => ({
      link: link.startsWith('//') ? `https:${link}` : link,
    })),
  };
}

const getUrlsContent = (urls) => {
  return Promise.all(
    urls.map((url) =>
      fetch(url)
        .then((response) => {
          return {
            htmlPromise: response.text(),
            // protocol: urlUtils.parse(url, "").protocol,
          };
        })
        .catch((error) => {
          console.error('Error fetching data from url: ', url, error);
          return null;
        }),
    ),
  );
};

const printUrlsContent = async () => {
  const jdDetailUrls = [];

  const tbDetailUrls = [
    'https://qsg5o0.faas.xiaoduoai.com/getTbDetailByNameAndId?usernick=%E7%8E%8B%E5%8A%9B%E5%AE%98%E6%96%B9%E6%97%97%E8%88%B0%E5%BA%97&num_iid=599776705275',
    // "https://qsg5o0.faas.xiaoduoai.com/getTbDetailByNameAndId?usernick=%E7%89%A9%E9%B8%A3%E6%97%97%E8%88%B0%E5%BA%97&num_iid=845500903947",
    // "https://qsg5o0.faas.xiaoduoai.com/getTbDetailByNameAndId?usernick=%E7%BF%9F%E6%B0%8F%E4%B8%89%E7%82%89%E6%97%97%E8%88%B0%E5%BA%97&num_iid=755426133706",
    // "https://qsg5o0.faas.xiaoduoai.com/getTbDetailByNameAndId?usernick=%E7%BF%9F%E6%B0%8F%E4%B8%89%E7%82%89%E6%97%97%E8%88%B0%E5%BA%97&num_iid=39826993708",
    // "https://qsg5o0.faas.xiaoduoai.com/getTbDetailByNameAndId?usernick=bettycgq&num_iid=22915860347",
    // "https://qsg5o0.faas.xiaoduoai.com/getTbDetailByNameAndId?usernick=%E5%85%A8%E5%8F%8B%E5%AE%B6%E5%B1%85%E5%AE%98%E6%96%B9%E6%97%97%E8%88%B0%E5%BA%97&num_iid=680927761028",
    // "https://qsg5o0.faas.xiaoduoai.com/getTbDetailByNameAndId?usernick=%E5%85%A8%E5%8F%8B%E5%AE%B6%E5%B1%85%E5%AE%98%E6%96%B9%E6%97%97%E8%88%B0%E5%BA%97&num_iid=798848111132",
    // "https://qsg5o0.faas.xiaoduoai.com/getTbDetailByNameAndId?usernick=%E7%BE%8E%E7%9A%84%E5%8E%A8%E6%88%BF%E5%B0%8F%E5%AE%B6%E7%94%B5%E6%97%97%E8%88%B0%E5%BA%97&num_iid=846960466714",
    // "https://qsg5o0.faas.xiaoduoai.com/getTbDetailByNameAndId?usernick=%E7%BE%8E%E7%9A%84%E5%8E%A8%E6%88%BF%E5%B0%8F%E5%AE%B6%E7%94%B5%E6%97%97%E8%88%B0%E5%BA%97&num_iid=841809535014",
    // "https://qsg5o0.faas.xiaoduoai.com/getTbDetailByNameAndId?usernick=%E7%BE%8E%E7%9A%84%E5%8E%A8%E5%8D%AB%E6%97%97%E8%88%B0%E5%BA%97&num_iid=711198078815",
    // "https://qsg5o0.faas.xiaoduoai.com/getTbDetailByNameAndId?usernick=%E7%BE%8E%E7%9A%84%E5%86%B0%E7%AE%B1%E6%97%97%E8%88%B0%E5%BA%97&num_iid=652340404900",
  ];

  const extraUrls = [
    'https://qsg5o0.faas.xiaoduoai.com/getTbDetailByNameAndId?usernick=bettycgq&num_iid=22915860347',
  ];

  const testHtml = `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF - 8">
  <meta name="viewport" content="width=device-width, initial - scale=1.0">
  <title>Document</title>
  <style>
   .image - container {
      width: 100%;
      height: auto;
      margin-bottom: 10px;
      background - size: cover;
      background - position: center;
    }
  </style>
</head>

<body>
  <div style="text-align:center;">
    <div class="image - container" style="background-image: url('//img10.360buyimg.com/imgzone/jfs/t1/69720/19/25548/8813/669f4dfdF923f413a/5d71d97a844dccbe.jpg');"></div>
    <div class="image - container" style="background-image: url('//img10.360buyimg.com/imgzone/jfs/t1/53091/30/26874/661999/004dd701F21cee1c4/85083d16e92b4913.gif');"></div>
    <div class="image - container" style="background-image: url('//img10.360buyimg.com/imgzone/jfs/t1/22974/39/20502/123618/669f4dfcF2768668b/5745940e0957b068.jpg');"></div>
    <div class="image - container" style="background-image: url('//img10.360buyimg.com/imgzone/jfs/t1/96225/29/45142/142085/669f4dfbFbbe33636/3c98870bfc2386c9.jpg');"></div>
    <div class="image - container" style="background-image: url('//img10.360buyimg.com/imgzone/jfs/t1/86806/23/49304/127026/669f4dfbF0b0e53e5/48fad3d1edd59017.jpg');"></div>
    <div class="image - container" style="background-image: url('//img10.360buyimg.com/imgzone/jfs/t1/228877/1/24561/111655/669f4dfaFbe29d0aa/669f9488963c6aaa.jpg');"></div>
    <div class="image - container" style="background-image: url('//img10.360buyimg.com/imgzone/jfs/t1/225384/13/8890/116447/669f4df9F8a63226a/65292906d2ff6d10.jpg');"></div>
    <div class="image - container" style="background-image: url('//img10.360buyimg.com/imgzone/jfs/t1/14663/37/21558/2389182/004dd701F03f0e9f3/014b28c810fa66a9.gif');"></div>
    <div class="image - container" style="background-image: url('//img10.360buyimg.com/imgzone/jfs/t1/239178/26/15478/141755/669f4df7F2fe1f277/a2907aba8b6d7d62.jpg');"></div>
    <div class="image - container" style="background-image: url('//img10.360buyimg.com/imgzone/jfs/t1/15009/40/22381/150073/669f4df6F2d5240c0/4b33ac8338f83413.jpg');"></div>
    <div class="image - container" style="background-image: url('//img10.360buyimg.com/imgzone/jfs/t1/233034/14/24007/540825/004dd701F673fc4b5/f98f8aa324d09f1c.gif');"></div>
    <div class="image - container" style="background-image: url('//img10.360buyimg.com/imgzone/jfs/t1/40040/10/21559/102184/669f4df4F8aa33e59/3143841b9eaf16be.jpg');"></div>
    <div class="image - container" style="background-image: url('//img10.360buyimg.com/imgzone/jfs/t1/70079/2/25442/78383/669f4df4F991529cb/4567e15d122e40c2.jpg');"></div>
    <div class="image - container" style="background-image: url('//img10.360buyimg.com/imgzone/jfs/t1/249117/13/15696/120286/669f4df3Fbf3a22bf/f1b236b8c9734c82.jpg');"></div>
    <div class="image - container" style="background-image: url('//img10.360buyimg.com/imgzone/jfs/t1/229767/39/22823/66143/669f4df2Fe1e2f6ca/e3409bde71c45ed9.jpg');"></div>
    <div class="image - container" style="background-image: url('//img10.360buyimg.com/imgzone/jfs/t1/225866/15/23754/739715/004dd701Fed245a68/8ca8a86e67c5cf45.gif');"></div>
    <div class="image - container" style="background-image: url('//img10.360buyimg.com/imgzone/jfs/t1/224896/4/20780/138254/669f4df1F821b7663/7865116fd7b258c9.jpg');"></div>
    <div class="image - container" style="background-image: url('//img10.360buyimg.com/imgzone/jfs/t1/19590/32/22487/134142/669f4df1Fdde38ee2/6ce83d9b6a5340fa.jpg');"></div>
    <div class="image - container" style="background-image: url('//img10.360buyimg.com/imgzone/jfs/t1/59979/18/25359/135393/669f4df0Fd25f9520/e9dd3fdeb155acd7.jpg');"></div>
    <div class="image - container" style="background-image: url('//img10.360buyimg.com/imgzone/jfs/t1/168207/24/52948/108388/6757d7c4F9532c3a6/d9704159de873c6b.jpg');"></div>
    <div class="image - container" style="background-image: url('//img10.360buyimg.com/imgzone/jfs/t1/221205/36/34466/56585/669f4e94F5f9e48aa/9916bdde4d36b006.jpg');"></div>
    <div class="image - container" style="background-image: url('//img10.360buyimg.com/imgzone/jfs/t1/108487/28/48235/51203/669f4e94Fddf70cb6/0809f4234a863074.jpg');"></div>
  </div>
</body>

</html>`;

  // const resJson = html2json({ html: testHtml });

  // console.log(`resJjson】：${JSON.stringify(resJson, null, 2)}`);

  const res = await getUrlsContent(tbDetailUrls);

  for (let i = 0; i < res.length; i++) {
    const { htmlPromise } = res[i];
    const html = await htmlPromise;
    const resJson = html2json({ html });

    console.log(`resJjson${i}】：${JSON.stringify(resJson, null, 2)}`);
  }
};

printUrlsContent();
