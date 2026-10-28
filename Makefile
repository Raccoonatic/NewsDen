# **************************************************************************** #
#                                                                              #
#                                                    ▒▓              ▓▒        #
#    Makefile                                       ▒▒ ▓▓▓        ▓▓▓ ▒▒       #
#                                                   ▒▒▒░░▒▒░▓░░▓░▒▒░░▒▒▒       #
#    By: Mapache <ljtorcate@gmail.com>               █░  ░░░ ░░ ░░░  ░█        #
#                                                    ███████░░░░███████        #
#    Created: 2026/10/19 07:44:25 by Mapache        ░▒▒██ ▓  ██  ▓ ██▒▒░       #
#    Updated: 2026/10/28 13:00:52 by Mapache            ▒ ░██  ██░ ▒           #
#                                                          ██████              #
#                                                                              #
# **************************************************************************** #

SHELL = /bin/bash
PSWD ?= ""

NEOR = \033[3m\033[38;2;255;153;51m
MINT = \033[1;38;2;55;250;133m
ORNG = \033[1;38;2;255;153;51m
PURP = \033[1;38;2;174;5;252m
PINK = \033[1;38;2;255;0;251m
BABY = \033[1;38;2;0;255;247m
BLOD = \033[1;38;2;255;0;0m
LIME = \033[1;38;2;0;255;0m
B_WI = \033[1;37m
RSET = \033[0m

DB_DIR = database/

SCHEMA = 01_enum_schema.sql
SCHEMA += 02_editor_schema.sql
SCHEMA += 03_reporter_schema.sql
SCHEMA += 04_article_schema.sql

BLUEPRINT = $(addprefix $(DB_DIR), $(SCHEMA))

all:
	@echo -e "\n$(MINT)        🦝 Checking operating system compatibility... 🦝\n$(B_WI)"
	@sleep 1
	@if ! command -v apt >/dev/null 2>&1; then \
		echo -e "$(BLOD)Error$(B_WI): $(BABY)This project requires the $(B_WI)'$(ORNG)apt$(B_WI)' $(BABY)package manager."; \
		echo -e "$(BABY)It looks like you might not be running $(PURP)Ubuntu $(BABY)or $(PURP)Debian$(B_WI). $(NEOR)Aborting...$(RSET)\n"; \
		exit 1; \
	fi; \
	OS_ID=$$(grep -E '^ID=' /etc/os-release | cut -d '=' -f 2 | tr -d '"'); \
	if [ "$$OS_ID" != "ubuntu" ] && [ "$$OS_ID" != "debian" ]; then \
		echo -e "$(BLOD)Error$(B_WI): $(BABY)NewsDen is optimized specifically for $(PURP)Ubuntu $(BABY)and $(PURP)Debian$(B_WI)."; \
		echo -e "$(BABY)Your OS $(NEOR)($$OS_ID) $(BABY)is currently unsupported. $(NEOR)Aborting...$(RSET)\n"; \
		exit 1; \
	fi
	@make tools
	@echo -e "\n"
	@echo -e "                 ${PURP}..*${LIME}#${PINK}>${BABY}--${LIME}>${BABY}>${MINT}===========${BABY}<${LIME}<${BABY}--${PINK}<${LIME}#${PURP}*..${RSET}\n"
	@echo -e "                 🦝   ${LIME}Postgre${MINT}SQL ${BABY}Database   🦝\n"
	@echo -e "                 ${PURP}..*${LIME}#${PINK}>${BABY}--${LIME}>${BABY}>${MINT}===========${BABY}<${LIME}<${BABY}--${PINK}<${LIME}#${PURP}*..${RSET}\n"
	@if sudo docker ps --format '{{.Names}}' | grep -q '^newsden-postgres$$'; then \
		echo -e "$(MINT)✓ Container $(B_WI)'$(LIME)newsden-postgres$(B_WI)' $(MINT)is already running. $(NEOR)Skipping...$(RSET)"; \
		echo -e "\n                       ${PINK}-${PURP}_${PINK}-${PURP}_${PINK}-${PURP}_${PINK}-${PURP}_${PINK}-${PURP}_${PINK}-${PURP}_${PINK}-${PURP}_${PINK}-${PURP}_${PINK}-${RSET}\n"; \
		sleep 0.5; \
	elif sudo docker ps -a --format '{{.Names}}' | grep -q '^newsden-postgres$$'; then \
		make postgres_up | grep newsden || true; \
		echo -e "\n                       ${PINK}-${PURP}_${PINK}-${PURP}_${PINK}-${PURP}_${PINK}-${PURP}_${PINK}-${PURP}_${PINK}-${PURP}_${PINK}-${PURP}_${PINK}-${PURP}_${PINK}-${RSET}\n"; \
	else \
		echo -e "$(ORNG)$(NEOR)    NewsDen uses Docker to run a local PostgreSQL database."; \
		echo -e " Please define a secure password for the 'postgres' superuser."; \
		echo -e "\n                       ${PINK}-${PURP}_${PINK}-${PURP}_${PINK}-${PURP}_${PINK}-${PURP}_${PINK}-${PURP}_${PINK}-${PURP}_${PINK}-${PURP}_${PINK}-${PURP}_${PINK}-${RSET}\n"; \
		while true; do \
			echo -e -n "$(MINT)Enter $(BABY)a database password$(B_WI):$(RSET) "; \
			DB_TMP=""; \
			while IFS= read -rsn1 char; do \
				if [[ $$char == $$'\0' ]]; then break; fi; \
				if [[ -z $$char ]]; then break; fi; \
				if [[ $$char == $$'\177' || $$char == $$'\b' ]]; then \
					if [ $${#DB_TMP} -gt 0 ]; then \
						DB_TMP=$${DB_TMP%?}; \
						echo -en "\b \b"; \
					fi; \
				else \
					DB_TMP+="$$char"; \
					echo -n "*"; \
				fi; \
			done; \
			echo ""; \
			echo -e -n "$(MINT)Confirm $(BABY)database password$(B_WI):$(RSET) "; \
			DB_TMP_CONFIRM=""; \
			while IFS= read -rsn1 char; do \
				if [[ $$char == $$'\0' ]]; then break; fi; \
				if [[ -z $$char ]]; then break; fi; \
				if [[ $$char == $$'\177' || $$char == $$'\b' ]]; then \
					if [ $${#DB_TMP_CONFIRM} -gt 0 ]; then \
						DB_TMP_CONFIRM=$${DB_TMP_CONFIRM%?}; \
						echo -en "\b \b"; \
					fi; \
				else \
					DB_TMP_CONFIRM+="$$char"; \
					echo -n "*"; \
				fi; \
			done; \
			echo ""; \
			if [ "$$DB_TMP" = "$$DB_TMP_CONFIRM" ] && [ -n "$$DB_TMP" ]; then \
				echo "$$DB_TMP" > ".tmp "; \
				echo -e "\n$(LIME)✓ $(BABY)Password captured $(LIME)securely$(B_WI)!$(RSET)"; \
				break; \
			else \
				echo -e "$(BLOD)Error$(B_WI): $(NEOR)Passwords do not match or are empty$(B_WI). $(ORNG)Please try again$(B_WI).$(RSET)"; \
			fi; \
		done; \
		echo ""; \
		make postgres_up PSWD="$$(cat ".tmp ")"; \
	fi
	@echo -e "\n"
	@sleep 2
	@make load_schemas
	sudo docker exec -i newsden-postgres psql -U postgres -d postgres < ./database/seed.sql
	@sleep 2
	@make launch
	# TODO: Remove seeding

rebirth: postgres_delete all

restart: postgres_down all

launch:
	@echo -e "\n$(MINT)             Starting $(LIME)Next.js $(MINT)development server$(B_WI)...$(RSET)"
	@echo -e "$(NEOR)\n     This window will now act as the running server, don't \n   close it while is working. If you need to use the terminal \n                    please open a new window.$(RSET)"
	@sleep 2
	@echo -n -e "\n$(B_WI)                🚀 Launching..."
	@sleep 1
	@echo -e -n "$(B_WI) In 3,"
	@sleep 1
	@echo -e -n " 2, "
	@sleep 1
	@echo -e -n "1"
	@sleep 1
	@echo -e -n "."
	@sleep 0.5
	@echo -e -n "."
	@sleep 0.5
	@echo -e -n ".$(RSET)"
	@sleep 0.5
	@echo -e " 🚀\n"
	@npm run dev

load_schemas:
	@if sudo docker ps --format '{{.Names}}' | grep -q '^newsden-postgres$$'; then \
		echo -e "\n$(NEOR)🦝 Loading up the Schemas...$(RSET)"; \
		sleep 3; \
		for file in $(BLUEPRINT); do \
			echo -e "\n$(BABY)➔ $(MINT)Loading $$file...$(RSET)"; \
			OUTPUT=$$(sudo docker exec -i newsden-postgres psql -U postgres -d postgres < "$$file" 2>&1); \
			if echo -e "$$OUTPUT" | grep -q "ERROR:"; then \
				if echo -e "$$OUTPUT" | grep -q "already exists"; then \
					echo -e "$(ORNG)⚠ Notice$(B_WI): $(MINT)Schema $(BABY)$$file $(MINT)already exist$(B_WI). $(PINK)Skipping...$(RSET)"; \
				else \
					echo -e "$(BLOD)❌ ERROR $(ORNG)loading $(BABY)$$file$(B_WI):$(RSET)\n$$OUTPUT"; \
					exit 1; \
				fi \
			else \
				echo -e "$(LIME)✓ Success$(RSET)"; \
			fi \
		done; \
		echo -e "\n$(LIME)✓ $(MINT)Database blueprints processed $(LIME)successfully$(RSET) 🦝"; \
	else \
		echo -e ""; \
		make postgres_status | grep Container; \
		echo -e "\n$(PINK)Please boot the database first$(RSET)"; \
		echo -e "$(BABY)See$(B_WI): $(RSET)$(NEOR)make postgres_up\n$(RSET)"; \
	fi

tools:
	@echo -e "$(MINT)\n             🦝 Checking for tools and updates! 🦝"
	@sleep 1
	@echo -e "$(B_WI)Here is the current list of tools and dependencies. Take a look, \nand confirm if you want to install or update all software below:\n"
	@echo -e "$(PINK)  - $(PURP)Git"
	@echo -e "$(PINK)  - $(PURP)Curl"
	@echo -e "$(PINK)  - $(PURP)Snap"
	@echo -e "$(PINK)  - $(PURP)Docker"
	@echo -e "$(PINK)  - $(PURP)DBeaver"
	@echo -e "$(PINK)  - $(PURP)Node.js"
	@echo -e "$(PINK)  - $(PURP)NVM (Node Version Manager)"
	@echo -e "$(PINK)  - $(PURP)NPM (Node Package Manager)"
	@echo -e "$(B_WI)\n     If you'd like to proceed, hit $(LIME)Enter$(B_WI). Otherwise, $(ORNG)cancel \n                    $(NEOR)(\"Ctrl + C\" by default).$(RSET)"
	@read dummy
	@echo -e "$(BABY)Updating Packages...$(RSET)"
	sudo apt update
	@sleep 2
	@echo -e "\n$(BABY)Checking Tools..."
	@sleep 2
	@if command -v git >/dev/null 2>&1; then \
	echo -e "$(BABY)✓$(MINT) Git $(LIME)is already installed. $(NEOR)Checking for updates...$(B_WI)"; \
		sudo apt install --only-upgrade -y git; \
		echo -e "$(RSET)"; \
	else \
	echo -e "$(PINK)✗$(MINT) Git $(BLOD)not found. $(NEOR)Installing...$(B_WI)"; \
		sudo apt install -y git; \
		echo -e "$(RSET)"; \
	fi
	@if command -v curl >/dev/null 2>&1; then \
	echo -e "$(BABY)✓$(MINT) Curl $(LIME)is already installed. $(NEOR)Checking for updates...$(B_WI)"; \
		sudo apt install --only-upgrade -y curl; \
		echo -e "$(RSET)"; \
	else \
	echo -e "$(PINK)✗$(MINT) Curl $(BLOD)not found. $(NEOR)Installing...$(B_WI)"; \
		sudo apt install -y curl; \
		echo -e "$(RSET)"; \
	fi
	@if command -v snap >/dev/null 2>&1; then \
	echo -e "$(BABY)✓$(MINT) Snap $(LIME)is already installed. $(NEOR)Checking for updates...$(B_WI)"; \
		sudo apt install --only-upgrade -y snapd; \
		echo -e "$(RSET)"; \
	else \
	echo -e "$(PINK)✗$(MINT) Snap $(BLOD)not found. $(NEOR)Installing...$(B_WI)"; \
		sudo apt install -y snapd; \
		echo -e "$(RSET)"; \
	fi
	@if command -v docker >/dev/null 2>&1; then \
	echo -e "$(BABY)✓$(MINT) Docker $(LIME)is already installed. $(NEOR)Checking for updates...$(B_WI)"; \
		sudo apt install --only-upgrade -y docker.io; \
		echo -e "$(RSET)"; \
	else \
	echo -e "$(PINK)✗$(MINT) Docker $(BLOD)not found. $(NEOR)Installing...$(B_WI)"; \
		sudo apt install -y docker.io; \
		echo -e "$(RSET)"; \
	fi
	@if command -v dbeaver-ce >/dev/null 2>&1; then \
	echo -e "$(BABY)✓$(MINT) DBeaver $(LIME)is already installed. $(NEOR)Checking for updates...$(B_WI)"; \
		sudo snap refresh dbeaver-ce; \
		echo -e "$(RSET)"; \
	else \
	echo -e "$(PINK)✗$(MINT) DBeaver $(BLOD)not found. $(NEOR)Installing...$(B_WI)"; \
		sudo snap install dbeaver-ce; \
		echo -e "$(RSET)"; \
	fi
	@if [ -s "$$HOME/.nvm/nvm.sh" ]; then \
		echo -e "$(BABY)✓$(MINT) NVM $(LIME)is already installed. $(NEOR)Checking for updates...$(B_WI)"; \
		cd $$HOME/.nvm && git fetch --tags origin && git checkout `git describe --abbrev=0 --tags --match "v[0-9]*" $(git rev-list --tags --max-count=1)` >/dev/null 2>&1 && cd - >/dev/null 2>&1; \
		echo -e "$(RSET)"; \
	else \
		echo -e "$(PINK)✗$(MINT) NVM $(BLOD)not found. $(NEOR)Installing...$(B_WI)"; \
		curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash >/dev/null 2>&1; \
		echo -e "$(RSET)"; \
	fi
	@if command -v node >/dev/null 2>&1 || [ -s "$$HOME/.nvm/nvm.sh" ]; then \
		echo -e "$(BABY)✓$(MINT) Node.js $(LIME)is already installed. $(NEOR)Checking for updates...$(B_WI)"; \
		. "$$HOME/.nvm/nvm.sh" && nvm install --lts >/dev/null 2>&1; \
		echo -e "$(RSET)"; \
	else \
		echo -e "$(PINK)✗$(MINT) Node.js $(BLOD)not found. $(NEOR)Installing...$(B_WI)"; \
		. "$$HOME/.nvm/nvm.sh" && nvm install --lts >/dev/null 2>&1; \
		echo -e "$(RSET)"; \
	fi
	@if command -v npm >/dev/null 2>&1 || [ -s "$$HOME/.nvm/nvm.sh" ]; then \
		echo -e "$(BABY)✓$(MINT) NPM (Node Package Manager) $(LIME)is already installed. $(NEOR)Checking for updates...$(B_WI)"; \
		. "$$HOME/.nvm/nvm.sh" && npm install -g npm@latest >/dev/null 2>&1; \
		if [ ! -d "node_modules" ]; then \
			npm install; \
		fi; \
		echo -e "$(RSET)"; \
	else \
		echo -e "$(PINK)✗$(MINT) NPM (Node Package Manager) $(BLOD)not found. $(NEOR)Installing...$(B_WI)"; \
		. "$$HOME/.nvm/nvm.sh" && npm install -g npm@latest >/dev/null 2>&1; \
		if [ ! -d "node_modules" ]; then \
			npm install; \
		fi; \
		echo -e "$(RSET)"; \
	fi

postgres_status:
	@echo -e ""
	@if sudo docker ps --format '{{.Names}}' | grep -q '^newsden-postgres$$'; then \
		echo -e "$(MINT)● $(NEOR)Container $(B_WI)'$(LIME)newsden-postgres$(B_WI)' $(NEOR)is $(MINT)RUNNING$(RSET)"; \
	elif sudo docker ps -a --format '{{.Names}}' | grep -q '^newsden-postgres$$'; then \
		echo -e "$(PINK)■ $(NEOR)Container $(B_WI)'$(LIME)newsden-postgres$(B_WI)' $(NEOR)is $(PINK)STOPPED.$(RSET)"; \
	else \
		echo -e "$(BLOD)✗ $(NEOR)Container $(B_WI)'$(LIME)newsden-postgres$(B_WI)' $(ORNG)DOES NOT EXIST ($(BLOD)Dead $(ORNG)/ $(BLOD)Deleted$(ORNG))$(B_WI).$(RSET)"; \
	fi
	@echo -e ""
	@sleep 1

postgres_up:
	@rm -f ".tmp ";
	@echo ""
	@if sudo docker ps --format '{{.Names}}' | grep -q '^newsden-postgres$$'; then \
		echo -e "$(MINT)✓ Container $(B_WI)'$(LIME)newsden-postgres$(B_WI)' $(MINT)is already running. $(NEOR)Skipping...$(RSET)\n"; \
		sleep 0.5; \
	elif sudo docker ps -a --format '{{.Names}}' | grep -q '^newsden-postgres$$'; then \
		echo -e "$(MINT)✓ Container $(B_WI)'$(LIME)newsden-postgres$(B_WI)' $(MINT)exists but is stopped. $(NEOR)Starting...$(RSET)\n"; \
		sudo docker start newsden-postgres; \
		sleep 1; \
	elif [ -z "$(PSWD)" ]; then \
		echo -e "$(BLOD)PASSWORD NOT ENTERED. $(ORNG)Please enter a valid password"; \
		echo -e "$(BABY)Usage$(B_WI): $(RSET)$(NEOR)make postgres_up $(LIME)PSWD$(PINK)=$(MINT)Valid_Password$(RSET)\n"; \
	else \
		echo -e "$(MINT)Creating and starting new $(B_WI)'$(BABY)newsden-postgres$(B_WI)' $(MINT)container...$(RSET)\n"; \
		sudo docker run --name newsden-postgres -e POSTGRES_PASSWORD=$(PSWD) -p 5432:5432 -d postgres:16; \
		touch .env.local; \
		echo -n "" >.env.local; \
		echo -e "PGHOST=localhost\nPGPORT=5432\nPGDATABASE=postgres\nPGUSER=postgres\nPGPASSWORD=$(PSWD)\n" >.env.local; \
		echo -n "DATABASE_URL=postgresql://postgres:" >>.env.local; \
		echo -n $(PSWD) >>.env.local && echo -e "@localhost:5432/postgres" >>.env.local; \
		sleep 1; \
	fi

postgres_down:
	@echo -e ""
	@if sudo docker ps --format '{{.Names}}' | grep -q '^newsden-postgres$$'; then \
		echo -e "$(BABY)Stopping $(B_WI)'$(LIME)newsden-postgres$(B_WI)' $(BABY)container...$(RSET)"; \
		sudo docker stop newsden-postgres; \
	elif sudo docker ps -a --format '{{.Names}}' | grep -q '^newsden-postgres$$'; then \
		echo -e "$(ORNG)Container $(B_WI)'$(LIME)newsden-postgres$(B_WI)' $(ORNG)is already stopped.$(RSET)"; \
	else \
		echo -e "$(ORNG)Container $(B_WI)'$(LIME)newsden-postgres$(B_WI)' $(ORNG)does not exist.$(RSET)"; \
	fi
	@echo -e ""

postgres_delete:
	@echo -e ""
	@if sudo docker ps -a --format '{{.Names}}' | grep -q '^newsden-postgres$$'; then \
		echo -n -e "$(ORNG)⚠ Removing $(B_WI)'$(LIME)newsden-postgres$(B_WI)' $(ORNG)container.$(RSET)"; \
		sleep 0.5; \
		echo -e -n "$(B_WI) In 3,"; \
		sleep 1; \
		echo -e -n " 2, "; \
		sleep 1; \
		echo -e -n "1. "; \
		sleep 0.5; \
		echo -e -n "$(BLOD)Boom"; \
		sleep 0.3; \
		echo -e -n "$(B_WI)."; \
		sleep 0.3; \
		echo -e -n "."; \
		sleep 0.3; \
		echo -e ".$(RSET)"; \
		sudo docker rm -f newsden-postgres; \
		rm -rf .env.local; \
	else \
		echo -e "$(ORNG)Container $(B_WI)'$(LIME)newsden-postgres$(B_WI)' $(ORNG)does not exist$(B_WI). $(NEOR)Nothing to delete.$(RSET)"; \
	fi
	@echo -e ""
