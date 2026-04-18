# ==========================================
# MYSQL DOCKERFILE - TEACHING REFERENCE
# ==========================================

# 1. FROM: Pin the base image version for stability
FROM mysql:8.0

# 2. LABEL: Provide metadata about this custom database image
LABEL maintainer="databridge-instructor" \
      service="database" \
      description="MySQL Database customized with Auto-Initialization"

# 3. ENV: Define default environment variables (can be overridden at runtime in docker-compose)
ENV MYSQL_ROOT_PASSWORD=root \
    MYSQL_DATABASE=appdb

# 4. VOLUME: Document persistent storage paths to remind users where data is saved
# (The MySQL base image declares this, adding it here reinforces the concept)
VOLUME ["/var/lib/mysql"]

# 5. COPY: Automatically run SQL scripts on container startup
# In MySQL official images, any .sql or .sh files in this specific directory run automatically upon creation
COPY init.sql /docker-entrypoint-initdb.d/

# 6. EXPOSE: Document the standard MySQL port
EXPOSE 3306

# 7. HEALTHCHECK: Wait for MySQL to be fully ready to accept client connections
# We use 'mysqladmin ping' against the database
HEALTHCHECK --interval=10s --timeout=5s --start-period=30s --retries=5 \
  CMD mysqladmin ping -h localhost -u root -p${MYSQL_ROOT_PASSWORD} || exit 1

# Note: The mysql:8.0 base image already sets ENTRYPOINT and CMD correctly,
# so we do not need to specify them unless we intend to override the root start script.
