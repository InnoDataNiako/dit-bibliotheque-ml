FROM python:3.11-slim

RUN groupadd -r flaskuser && useradd -r -g flaskuser flaskuser

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN chown -R flaskuser:flaskuser /app
USER flaskuser

EXPOSE 5000

CMD ["flask", "run", "--host=0.0.0.0"]