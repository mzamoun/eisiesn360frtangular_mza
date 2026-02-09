#!/bin/sh

DIR_DEV=/cygdrive/c/Users/mza/Documents/home
d1=$DIR_DEV/bitbucket/eisiesn360frtangular
d2=$DIR_DEV/github/eisiesn360frtangular2

usage() {
    echo "
        Usage : $0 
    "
    exit 1
}

echo "
    Go to copy to github ...
"

exit_if_dir_not_exist() {
    [ ! -d $1 ] && {
        echo "
            DIR not Exist : $1
        "
        exit 1
    }
}

exit_if_dir_not_exist $DIR_DEV
exit_if_dir_not_exist $d1
exit_if_dir_not_exist $d2

date_deb=$(date_now.sh)

# replace space by _
cd $d1 
for f in *; do 
    g=$(echo "$f" | sed 's/ /_/g')
    [ "$f" != "$g" ] && {
        mv "$f" $g 
    }
done 

ang_cp_proj.sh $d1 $d2

date_fin=$(date_now.sh)

echo "
    $0
    $date_deb
    $date_fin 
"
