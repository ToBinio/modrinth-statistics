build version:
    docker build -t modrinth-statistics:{{version}} .

publish version: (build version)
    docker tag modrinth-statistics:{{version}} ghcr.io/tobinio/modrinth-statistics:{{version}}
    docker push ghcr.io/tobinio/modrinth-statistics:{{version}}
