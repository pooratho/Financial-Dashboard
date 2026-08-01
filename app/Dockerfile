# Stage 1: Builder
FROM docker.arvancloud.ir/python:3.11 AS builder

WORKDIR /app
COPY requirements.txt .
RUN pip install --user --no-cache-dir -i https://mirror-pypi.runflare.com/simple -r requirements.txt

# Stage 2: Final Image
FROM docker.arvancloud.ir/python:3.11-slim

WORKDIR /app
COPY --from=builder /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH
COPY . .

EXPOSE 8000

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "myproject.wsgi:application"]
