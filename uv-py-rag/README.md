### init project

mkdir uv-py-rag
uv init .

### dependency description

sentence_transformer: 加载 embedding 和 cross-encoder 模型
chromadb: 一个非常流行的向量数据库
google-genai: Google 的 AISDK,调用 gemini-2.5-flash 必备
python-dotenv: 将 GeminiAPIKey 映射到环境变量中

## 运行

uv run --with jupyter jupyter lab # uv 启动 jupyter lab
