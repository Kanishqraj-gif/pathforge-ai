FROM node:22-bookworm

WORKDIR /app

RUN apt-get update \
    && apt-get install -y python3 python3-venv \
    && rm -rf /var/lib/apt/lists/*

RUN python3 -m venv /opt/venv

ENV PATH="/opt/venv/bin:$PATH"

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 10000

CMD ["node", "server/index.js"]