@echo off
rem Reunions de comite des Communes, depuis le PC de Martin (26 nov. 2026).
rem La Chambre refuse les serveurs de GitHub (403) : ce scraper roule ici, une fois par jour,
rem par la tache planifiee « DossierCanada comites ». Seulement le neuf, une requete a la fois.
rem La cle d'API est lue dans api.env (jamais dans ce fichier). Journal : debats-local.log.
cd /d "%~dp0.."
echo ==== %date% %time% >> debats-local.log
git pull --rebase -q >> debats-local.log 2>&1
node scrapers/debats.js >> debats-local.log 2>&1
git add data/debats.json data/debats-site.json data/debats-archives.json
git diff --cached --quiet && (echo rien de neuf >> debats-local.log) && exit /b 0
git commit -q -m "chore: reunions de comite (PC local)" >> debats-local.log 2>&1
git push -q >> debats-local.log 2>&1 || (git pull --rebase -q && git push -q) >> debats-local.log 2>&1
