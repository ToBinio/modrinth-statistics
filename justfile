build version:
    docker build -t modrinth-statistics:{{version}} .

publish version: (build version)
    docker tag modrinth-statistics:{{version}} tobinio/modrinth-statistics:{{version}}
    docker push tobinio/modrinth-statistics:{{version}}
