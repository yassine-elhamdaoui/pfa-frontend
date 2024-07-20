# FROM baseImage
FROM nginx
# COPY source dest///////dest=racine duu serveur web nginx
COPY dist /usr/share/nginx/html