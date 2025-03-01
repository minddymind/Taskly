FROM node:18-alpine AS builder

# Set the working directory in the container
WORKDIR /app

# Install dependencies separately to leverage Docker cache
COPY package*.json ./
RUN npm install --frozen-lockfile

# Copy only necessary source files first
COPY prisma ./prisma
COPY . .

# Generate Prisma Client & Build application
RUN npx prisma generate && npm run build

# -- Production Image --
FROM node:18-alpine AS runner
WORKDIR /app

# Copy only required files from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
