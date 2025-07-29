import { Message, EmbedBuilder, SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { CommandCategory } from '../../types/Command';

export const data = {
  name: 'weather',
  description: 'Get weather information for any location',
  category: CommandCategory.INFORMATION,
  usage: '!weather <location>',
  aliases: ['w', 'forecast'],
  cooldown: 10
};

export const slashData = new SlashCommandBuilder()
  .setName('weather')
  .setDescription('Get weather information for any location')
  .addStringOption(option =>
    option.setName('location')
      .setDescription('City name or location')
      .setRequired(true)
  );

// Mock weather data (in a real implementation, you'd use a weather API)
const weatherConditions = {
  'sunny': { emoji: '☀️', color: 0xFFD700 },
  'cloudy': { emoji: '☁️', color: 0x87CEEB },
  'rainy': { emoji: '🌧️', color: 0x4682B4 },
  'snowy': { emoji: '❄️', color: 0xF0F8FF },
  'stormy': { emoji: '⛈️', color: 0x2F4F4F },
  'foggy': { emoji: '🌫️', color: 0xD3D3D3 },
  'partly_cloudy': { emoji: '⛅', color: 0xB0C4DE }
};

function getWeatherEmoji(temp: number, condition: string): string {
  if (temp < 0) return '❄️';
  if (temp < 10) return '🌡️';
  if (temp < 20) return '🌤️';
  if (temp < 30) return '☀️';
  return '🔥';
}

function generateMockWeather(location: string) {
  const conditions = Object.keys(weatherConditions);
  const condition = conditions[Math.floor(Math.random() * conditions.length)];
  const temp = Math.floor(Math.random() * 40) - 5; // -5 to 35°C
  const humidity = Math.floor(Math.random() * 40) + 40; // 40-80%
  const windSpeed = Math.floor(Math.random() * 30) + 5; // 5-35 km/h
  const pressure = Math.floor(Math.random() * 50) + 1000; // 1000-1050 hPa
  
  return {
    location: location.charAt(0).toUpperCase() + location.slice(1),
    condition,
    temperature: temp,
    humidity,
    windSpeed,
    pressure,
    feelsLike: temp + Math.floor(Math.random() * 6) - 3,
    visibility: Math.floor(Math.random() * 10) + 5 // 5-15 km
  };
}

function getWindDirection(speed: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.floor((speed / 30) * 8) % 8;
  return directions[index];
}

function getUVIndex(temp: number): string {
  if (temp < 10) return 'Low (1-2)';
  if (temp < 20) return 'Moderate (3-5)';
  if (temp < 30) return 'High (6-7)';
  return 'Very High (8-10)';
}

export async function execute(message: Message, args?: string[]) {
  if (!args || args.length === 0) {
    await message.reply('❌ Please provide a location! Usage: `!weather <location>`');
    return;
  }

  const location = args.join(' ');
  const weather = generateMockWeather(location);
  const condition = weatherConditions[weather.condition as keyof typeof weatherConditions];
  
  const embed = new EmbedBuilder()
    .setTitle(`${condition.emoji} Weather in ${weather.location}`)
    .setDescription(`**${weather.condition.charAt(0).toUpperCase() + weather.condition.slice(1)}**`)
    .setColor(condition.color)
    .addFields([
      { 
        name: '🌡️ Temperature', 
        value: `${weather.temperature}°C (feels like ${weather.feelsLike}°C)`, 
        inline: true 
      },
      { 
        name: '💧 Humidity', 
        value: `${weather.humidity}%`, 
        inline: true 
      },
      { 
        name: '💨 Wind', 
        value: `${weather.windSpeed} km/h ${getWindDirection(weather.windSpeed)}`, 
        inline: true 
      },
      { 
        name: '📊 Pressure', 
        value: `${weather.pressure} hPa`, 
        inline: true 
      },
      { 
        name: '👁️ Visibility', 
        value: `${weather.visibility} km`, 
        inline: true 
      },
      { 
        name: '☀️ UV Index', 
        value: getUVIndex(weather.temperature), 
        inline: true 
      }
    ])
    .setFooter({ 
      text: `Weather data for ${weather.location} • Last updated: ${new Date().toLocaleTimeString()}`,
      iconURL: message.author.displayAvatarURL()
    })
    .setTimestamp();

  await message.reply({ embeds: [embed] });
}

export async function executeSlash(interaction: ChatInputCommandInteraction) {
  const location = interaction.options.getString('location')!;
  const weather = generateMockWeather(location);
  const condition = weatherConditions[weather.condition as keyof typeof weatherConditions];
  
  const embed = new EmbedBuilder()
    .setTitle(`${condition.emoji} Weather in ${weather.location}`)
    .setDescription(`**${weather.condition.charAt(0).toUpperCase() + weather.condition.slice(1)}**`)
    .setColor(condition.color)
    .addFields([
      { 
        name: '🌡️ Temperature', 
        value: `${weather.temperature}°C (feels like ${weather.feelsLike}°C)`, 
        inline: true 
      },
      { 
        name: '💧 Humidity', 
        value: `${weather.humidity}%`, 
        inline: true 
      },
      { 
        name: '💨 Wind', 
        value: `${weather.windSpeed} km/h ${getWindDirection(weather.windSpeed)}`, 
        inline: true 
      },
      { 
        name: '📊 Pressure', 
        value: `${weather.pressure} hPa`, 
        inline: true 
      },
      { 
        name: '👁️ Visibility', 
        value: `${weather.visibility} km`, 
        inline: true 
      },
      { 
        name: '☀️ UV Index', 
        value: getUVIndex(weather.temperature), 
        inline: true 
      }
    ])
    .setFooter({ 
      text: `Weather data for ${weather.location} • Last updated: ${new Date().toLocaleTimeString()}`,
      iconURL: interaction.user.displayAvatarURL()
    })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
} 