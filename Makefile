# **************************************************************************** #
#                                                                              #
#                                                    ▒▓              ▓▒        #
#    Makefile                                       ▒▒ ▓▓▓        ▓▓▓ ▒▒       #
#                                                   ▒▒▒░░▒▒░▓░░▓░▒▒░░▒▒▒       #
#    By: Mapache <ljtorcate@gmail.com>               █░  ░░░ ░░ ░░░  ░█        #
#                                                    ███████░░░░███████        #
#    Created: 2026/10/19 07:44:25 by Mapache        ░▒▒██ ▓  ██  ▓ ██▒▒░       #
#    Updated: 2026/10/19 11:11:05 by Mapache            ▒ ░██  ██░ ▒           #
#                                                          ██████              #
#                                                                              #
# **************************************************************************** #

PW ?= ""

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

DB_DIR = ./database/

SCHEMA = 01_enum_schema.sql
SCHEMA += 02_badge_schema.sql
SCHEMA += 03_user_schema.sql
SCHEMA += 04_article_schema.sql

load_schemas:
	@RET=command make postgres_status
	if [$RET -eq "$(MINT)● $(NEOR)Container $(B_WI)'$(LIME)newsden-postgres$(B_WI)' $(NEOR)is $(MINT)RUNNING$(RSET)"]; then \
		echo "$(NEOR)🦝 Loading up the schemas..."; \
		make db_blueprint; \
	else \
		echo "$(RET)"; \
	fi

db_blueprint: $(DB_DIR)%.sql
	sudo docker exec -i newsden-postgres psql -U postgres -d postgres < $<

tools:
	@echo "$(MINT)\t  🦝 Checking for tools and updates! 🦝"
	@sleep 1
	@echo "$(B_WI)Here is the current list of tools and dependencies. Take a look, \nand confirm if you want to install or update all software below:\n"
	@echo "$(PINK)- $(PURP)Git"
	@echo "$(PINK)- $(PURP)Docker"
	@echo "$(PINK)- $(PURP)DBeaver"
	@echo "$(B_WI)\nIf you'd like to proceed, hit enter. Otherwise, cancel (\"Ctrl + C\" by default).$(RSET)"
	@read dummy
	@echo "$(BABY)Updating Packages...$(RSET)"
	sudo apt update
	@sleep 2
	@echo "$(BABY)Checking Tools..."
	@sleep 2
	@if command -v git >/dev/null 2>&1; then \
		echo "$(MINT)✓ Git $(LIME)is already installed. $(NEOR)Checking for updates...$(B_WI)"; \
		sudo apt install --only-upgrade -y git; \
		echo "$(RSET)"; \
	else \
		echo "$(MINT)✗ Git $(BLOD)not found. $(NEOR)Installing...$(B_WI)"; \
		sudo apt install -y git; \
		echo "$(RSET)"; \
	fi
	@if command -v docker >/dev/null 2>&1; then \
		echo "$(MINT)✓ Docker $(LIME)is already installed. $(NEOR)Checking for updates...$(B_WI)"; \
		sudo apt install --only-upgrade -y docker.io; \
		echo "$(RSET)"; \
	else \
		echo "$(MINT)✗ Docker $(BLOD)not found. $(NEOR)Installing...$(B_WI)"; \
		sudo apt install -y docker.io; \
		echo "$(RSET)"; \
	fi
	@if command -v dbeaver-ce >/dev/null 2>&1; then \
		echo "$(MINT)✓ DBeaver $(LIME)is already installed. $(NEOR)Checking for updates...$(B_WI)"; \
		sudo snap refresh dbeaver-ce; \
		echo "$(RSET)"; \
	else \
		echo "$(MINT)✗ DBeaver $(BLOD)not found. $(NEOR)Installing...$(B_WI)"; \
		sudo snap install dbeaver-ce; \
		echo "$(RSET)"; \
	fi

postgres_status:
	@if sudo docker ps --format '{{.Names}}' | grep -q '^newsden-postgres$$'; then \
		echo "$(MINT)● $(NEOR)Container $(B_WI)'$(LIME)newsden-postgres$(B_WI)' $(NEOR)is $(MINT)RUNNING$(RSET)"; \
	elif sudo docker ps -a --format '{{.Names}}' | grep -q '^newsden-postgres$$'; then \
		echo "$(PINK)■ $(NEOR)Container $(B_WI)'$(LIME)newsden-postgres$(B_WI)' $(NEOR)is $(PINK)STOPPED.$(RSET)"; \
	else \
		echo "$(BLOD)✗ $(NEOR)Container $(B_WI)'$(LIME)newsden-postgres$(B_WI)' $(ORNG)DOES NOT EXIST ($(BLOD)Dead $(ORNG)/ $(BLOD)Deleted$(ORNG))$(B_WI).$(RSET)"; \
	fi

postgres_up:
	@if sudo docker ps --format '{{.Names}}' | grep -q '^newsden-postgres$$'; then \
		echo "$(MINT)✓ Container $(B_WI)'$(LIME)newsden-postgres$(B_WI)' $(MINT)is already running. $(NEOR)Aborting...$(RSET)"; \
	elif sudo docker ps -a --format '{{.Names}}' | grep -q '^newsden-postgres$$'; then \
		echo "$(MINT)✓ Container $(B_WI)'$(LIME)newsden-postgres$(B_WI)' $(MINT)exists but is stopped. $(NEOR)Starting...$(RSET)"; \
		sudo docker start newsden-postgres; \
	elif [ -z "$(PW)" ]; then \
		echo "$(BLOD)PASSWORD NOT ENTERED. $(ORNG)Please enter a valid password"; \
		echo "$(BABY)Usage$(B_WI): $(RSET)$(NEOR)make postgres_boot_up $(LIME)PW$(PINK)=$(MINT)Valid_Password\n$(RSET)"; \
	else \
		echo "$(MINT)Creating and starting new $(B_WI)'$(BABY)newsden-postgres$(B_WI)' $(MINT)container...$(RSET)"; \
		sudo docker run --name newsden-postgres -e POSTGRES_PASSWORD=$(PW) -p 5432:5432 -d postgres:16; \
	fi \

postgres_down:
	@if sudo docker ps --format '{{.Names}}' | grep -q '^newsden-postgres$$'; then \
		echo "$(BABY)Stopping $(B_WI)'$(LIME)newsden-postgres$(B_WI)' $(BABY)container...$(RSET)"; \
		sudo docker stop newsden-postgres; \
	elif sudo docker ps -a --format '{{.Names}}' | grep -q '^newsden-postgres$$'; then \
		echo "$(ORNG)Container $(B_WI)'$(LIME)newsden-postgres$(B_WI)' $(ORNG)is already stopped.$(RSET)"; \
	else \
		echo "$(ORNG)Container $(B_WI)'$(LIME)newsden-postgres$(B_WI)' $(ORNG)does not exist.$(RSET)"; \
	fi

postgres_delete:
	@if sudo docker ps -a --format '{{.Names}}' | grep -q '^newsden-postgres$$'; then \
		echo "$(PURP)⚠️  Removing $(B_WI)'$(LIME)newsden-postgres$(B_WI)' $(PURP)container...$(RSET)"; \
		sudo docker rm -f newsden-postgres; \
	else \
		echo "$(ORNG)Container $(B_WI)'$(LIME)newsden-postgres$(B_WI)' $(ORNG)does not exist$(B_WI). $(NEOR)Nothing to delete.$(RSET)"; \
	fi
