printf '#!/bin/bash
if [ -z "$1" ]
    then
        analyse_path="app/code/Magento/Developer/Console/Command/DiInfoCommand.php"
    else
        analyse_path="$1"
fi
if [ -z "$2" ]
    then
        level=0
    else
        level=$2
fi
vendor/bin/phpcs $analyse_path --standard=Magento2
vendor/bin/phpmd $analyse_path text dev/tests/static/testsuite/Magento/Test/Php/_files/phpmd/ruleset.xml
vendor/bin/phpstan analyse $analyse_path --level=$level\n' > analyse
