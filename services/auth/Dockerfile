FROM python:3.11-slim

RUN groupadd -r authuser && useradd -r -g authuser authuser

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN chown -R authuser:authuser /app
USER authuser

EXPOSE 5000

CMD ["flask", "run", "--host=0.0.0.0"]