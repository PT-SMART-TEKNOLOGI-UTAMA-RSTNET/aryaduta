git reset --hard
git pull https://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:x-oauth-basic@github.com/PT-SMART-TEKNOLOGI-UTAMA-RSTNET/aryaduta.git main

chmod -R 755 public

php artisan migrate --seed
php artisan config:cache
