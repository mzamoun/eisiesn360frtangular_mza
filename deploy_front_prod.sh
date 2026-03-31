DIR_SRC="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

date_deb=$(date_now.sh)
echo "
$date_deb $0 $*
"

set -e
# faire un trap exit pour appeler back_envs en cas de sortie du script
trap back_envs EXIT
chmod 755 *.sh

usage() {

    echo "
        $0 comment_save
    "
    exit 1
}

export LC_COLLATE=C
export LC_ALL=C

if [[ "$1" == "--help" || "$1" == "-h" ]]; then usage; fi 
if (($#<1)); then usage; fi 
comment_save=$(echo "$*" | tr ' ' '_')

proj_prod=$(basename $PWD)
proj_dev=$(echo $proj_prod | sed 's/_prod//')
LOG="$proj_prod.log"
DIR_ENV=src/environments

branch_name=$(git rev-parse --abbrev-ref HEAD)
if [[ "$branch_name" != "prod" ]]; then
    echo "You are on branch $branch_name. Please switch to prod branch to deploy."
    exit 1
fi

# modifier les fichiers environnement.ts et environnement.prod.ts
# pour les adapter à la production

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')]  $*" 
}

save_envs() {
    log "Saving environment files..."
    cp $DIR_ENV/environment.ts $DIR_ENV/environment.ts.back
    cp $DIR_ENV/environment.prod.ts $DIR_ENV/environment.prod.ts.back
}

back_envs() {
    log "Restoring environment files..."
    cp $DIR_ENV/environment.ts.back $DIR_ENV/environment.ts
    cp $DIR_ENV/environment.prod.ts.back $DIR_ENV/environment.prod.ts
}

set_url_prod() {
    log "Setting production URL in environment.prod.ts..."
    # changer la constante url en lui donnant la valeur url_prod
    sed -i 's/const url = .*/const url = url_prod/' $DIR_ENV/environment.prod.ts
    sed -i 's/const url = .*/const url = url_prod/' $DIR_ENV/environment.ts

    # changer la constante urlFront en lui donnant la valeur urlFront_prod
    sed -i 's/const urlFront = .*/const urlFront = urlFront_prod/' $DIR_ENV/environment.prod.ts
    sed -i 's/const urlFront = .*/const urlFront = urlFront_prod/' $DIR_ENV/environment.ts
}

save_to_git() {
    log "Saving changes to git..."
    git add . && git commit -m "$comment_save" && git push
}

copy_from_dev(){
    log "Copying environment files from development..."
    ang_cp_proj.sh ../$proj_dev .
}

deploy() {
    log "Starting deployment process..."
    save_envs
    set_url_prod
    chmod 755 *.sh
    ./build_front.sh
    save_to_git
    # TODO est ce necessaire ici ?
    back_envs
}

chmod 755 *.sh

log "Starting deployment of $proj_prod with comment: $comment_save" > $LOG
log "Fichier de LOG : $LOG" >> $LOG
exec >>$LOG 2>&1

chmod 755 *.sh
copy_from_dev

chmod 755 *.sh
deploy

chmod 755 *.sh

log "Deployment completed successfully."
