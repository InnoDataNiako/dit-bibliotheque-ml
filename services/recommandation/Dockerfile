# ============================================
# STAGE 1 : Build / Développement
# ============================================
FROM python:3.11-slim AS development

RUN groupadd -r mluser && useradd -r -g mluser mluser

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN mkdir -p /app/model /app/data
RUN chown -R mluser:mluser /app

USER mluser

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]


# ============================================
# STAGE 2 : Production
# ============================================
FROM python:3.11-slim AS production

RUN groupadd -r mluser && useradd -r -g mluser mluser

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN mkdir -p /app/model /app/data
RUN chown -R mluser:mluser /app

USER mluser

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]