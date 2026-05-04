set -e

file_logger="src/app/service/logger.service.ts"
file_compo_mere="src/app/compo/_utils/mere-component.ts"
file_credentials="src/app/auth/credentials.ts"

replace_one() {
  local file="$1"
    echo "Processing $file ..."
    echo "  Replacing console.error with this.logger.error"
  sed -i "s/console\.error(/this.logger.error(/g" "$file"
    echo "  Replacing console.warn with this.logger.warn"
  sed -i "s/console\.warn(/this.logger.warn(/g" "$file"
    echo "  Replacing console.info with this.logger.info"
  sed -i "s/console\.info(/this.logger.info(/g" "$file"
    echo "  Replacing console.debug with this.logger.debug"
  sed -i "s/console\.debug(/this.logger.debug(/g" "$file"
    echo "  Replacing console.log with this.logger.debug"
  sed -i "s/console\.log(/this.logger.debug(/g" "$file"
    echo "end of $file"
}

is_extendsMereComponent() {
  local file="$1"

  if grep -q "extends MereComponent" "$file"; then
    return 0
  else
    return 1
  fi
}

add_in_constructor() {
  local file="$1"

  echo "Processing $file for constructor ..."

  if ! grep -q "private logger: LoggerService" "$file" && ! grep -q "public logger: LoggerService" "$file"; then
    echo "  Adding LoggerService to constructor"
    sed -i "s/constructor(/constructor(private logger: LoggerService, /g" "$file"
  fi

}

add_import_file_compo() {
  local file="$1"

  if is_extendsMereComponent "$file"; then
    echo "  File extends MereComponent, skipping import of LoggerService"
    return
  fi

  echo "Processing $file for imports ..."

  if ! grep -q "import { LoggerService } from 'src/app/service/logger.service';" "$file"; then
    echo "  Adding import statement for LoggerService"
    sed -i "1i import { LoggerService } from 'src/app/service/logger.service';" "$file"
  fi

  add_in_constructor "$file"

}

add_import_in_file_service() {
  local file="$1"

  echo "Processing $file for imports ..."

  if ! grep -q "import { LoggerService } from './logger.service';" "$file"; then
    echo "  Adding import statement for LoggerService"
    sed -i "1i import { LoggerService } from './logger.service';" "$file"
  fi

  add_in_constructor "$file"
}

files=(
  "src/app/service/data-sharing.service.ts"
  "src/app/compo/cra/cra-form/cra-form-cal.component.ts"
  "src/app/compo/dashboard/dashboard.component.ts"
  "src/app/compo/_utils/mere-component.ts"
  "src/app/compo/_utils/relations-viewer/relations-d3.component.ts"
  "src/app/compo/_utils/table-viewer/table-viewer.component.ts"
  "src/app/compo/activity/activity-form/activity-form.component.ts"
  "src/app/compo/activity/activity-list/activity-list.component.ts"
)
# for f in "${files[@]}"; do
#   replace_one "$f"
# done

traiter_files_services() {
  for f in src/app/service/*.ts ; do
    [ -f "$f" ] || continue
    [ "$f" = "$file_logger" ] && continue

    # replace_one "$f"
    add_import_in_file_service "$f"
  done
}

traiter_files_compo1() {
  for f in src/app/compo/*/*.ts; do
    [ -f "$f" ] || continue
    [ "$f" = "$file_logger" ] && continue
    [ "$f" = "$file_compo_mere" ] && continue
    [ "$f" = "$file_credentials" ] && continue

    # replace_one "$f"
    add_import_file_compo "$f"
  done
}

traiter_files_compo2() {
  for f in src/app/compo/*/*/*.ts; do
    [ -f "$f" ] || continue
    [ "$f" = "$file_logger" ] && continue
    [ "$f" = "$file_compo_mere" ] && continue
    [ "$f" = "$file_credentials" ] && continue
    # replace_one "$f"
    add_import_file_compo "$f"
  done
}

traiter_files_other() {
  local x="$1"
  for f in $(find "src/app/$x" -type f -name "*.ts"); do
    [ -f "$f" ] || continue
    [ "$f" = "$file_logger" ] && continue
    [ "$f" = "$file_compo_mere" ] && continue
    [ "$f" = "$file_credentials" ] && continue
    # replace_one "$f"
    add_import_file_compo "$f"
  done
}


# traiter_files_services
# traiter_files_compo1

# traiter_files_other auth
# traiter_files_other authorization
# traiter_files_other core
# traiter_files_other home
# traiter_files_other layout


echo "done"
