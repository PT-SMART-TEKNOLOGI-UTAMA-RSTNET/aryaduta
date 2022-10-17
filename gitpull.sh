git reset --hard
git pull https://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:x-oauth-basic@github.com/PT-SMART-TEKNOLOGI-UTAMA-RSTNET/aryaduta.git main

chmod -R 755 public

php artisan migrate --seed
php artisan config:cache
