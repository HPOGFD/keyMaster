import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import { UserFactory } from './user.js';
import { TicketFactory } from './ticket.js';

dotenv.config();

let sequelize: Sequelize;

try {
  if (process.env.DB_URL) {
    sequelize = new Sequelize(process.env.DB_URL);
  } else {
    if (!process.env.DB_NAME || !process.env.DB_USER || !process.env.DB_PASSWORD) {
      throw new Error('Database configuration missing. Please check your .env file');
    }
    
    sequelize = new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: 'localhost',
        dialect: 'postgres',
        dialectOptions: {
          decimalNumbers: true,
        },
        logging: console.log, // This will help us see the SQL queries
      }
    );
  }
} catch (error) {
  console.error('Failed to initialize database:', error);
  throw error;
}

// Test the connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
}

testConnection();

const User = UserFactory(sequelize);
const Ticket = TicketFactory(sequelize);

// Define associations
User.hasMany(Ticket, { foreignKey: 'assignedUserId' });
Ticket.belongsTo(User, { foreignKey: 'assignedUserId', as: 'assignedUser'});

export { sequelize, User, Ticket };