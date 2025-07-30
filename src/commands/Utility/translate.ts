// src/commands/translate.ts
import { 
  Message, 
  EmbedBuilder, 
  ActionRowBuilder, 
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  StringSelectMenuInteraction,
  ButtonBuilder,
  ButtonStyle,
  MessageFlags,
  EmbedField
} from 'discord.js';
import axios from 'axios';


const LANGUAGES = [
  { code: 'en', name: 'English', emoji: '🇬🇧', native: 'English' },
  { code: 'es', name: 'Spanish', emoji: '🇪🇸', native: 'Español' },
  { code: 'fr', name: 'French', emoji: '🇫🇷', native: 'Français' },
  { code: 'de', name: 'German', emoji: '🇩🇪', native: 'Deutsch' },
  { code: 'ja', name: 'Japanese', emoji: '🇯🇵', native: '日本語' },
  { code: 'ru', name: 'Russian', emoji: '🇷🇺', native: 'Русский' },
  { code: 'zh', name: 'Chinese', emoji: '🇨🇳', native: '中文' },
  { code: 'ar', name: 'Arabic', emoji: '🇸🇦', native: 'العربية' },
  { code: 'hi', name: 'Hindi', emoji: '🇮🇳', native: 'हिन्दी' },
  { code: 'pt', name: 'Portuguese', emoji: '🇵🇱', native: 'Português' }
];

export const data = {
  name: 'translate',
  description: 'Translate text between multiple languages',
  category: CommandCategory.UTILITY,
  usage: '!translate [text]',
  aliases: ['tr', 'translation'],
  cooldown: 5
};

export async function execute(message: Message, args: string[]) {
  const text = args.join(' ');
  if (!text) {
    const helpEmbed = new EmbedBuilder()
      .setTitle('🌍 Translation Command')
      .setDescription('Translate text between multiple languages using advanced AI translation services.')
      .addFields([
        { name: '💡 Usage', value: '`!translate [text]`', inline: true },
        { name: '🌐 Languages', value: '10+ languages supported', inline: true },
        { name: '⚡ Features', value: 'Auto-detection, multiple APIs', inline: true }
      ])
      .setColor(0x3498db)
      .setFooter({ text: 'Select a language below to get started' });
    
    return message.reply({ embeds: [helpEmbed] });
  }
  
  if (text.length > 500) {
    return message.reply('❌ Text too long (maximum 500 characters)');
  }

  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId('translate_lang')
    .setPlaceholder('🌍 Select target language')
    .addOptions(
      LANGUAGES.map(lang => 
        new StringSelectMenuOptionBuilder()
          .setLabel(`${lang.emoji} ${lang.name}`)
          .setDescription(`Translate to ${lang.native}`)
          .setValue(lang.code)
      )
    );

  const row = new ActionRowBuilder<StringSelectMenuBuilder>()
    .addComponents(selectMenu);

  const embed = new EmbedBuilder()
    .setTitle('🌍 Translation Request')
    .setDescription(`**Original Text:**\n\`\`\`${text}\`\`\``)
    .addFields([
      { name: '📊 Text Length', value: `${text.length}/500 characters`, inline: true },
      { name: '🌐 Languages', value: `${LANGUAGES.length} available`, inline: true },
      { name: '⚡ Service', value: 'AI-powered translation', inline: true }
    ])
    .setColor(0x3498db)
    .setThumbnail('https://cdn.discordapp.com/emojis/1234567890.png') // Add a globe emoji URL
    .setFooter({ text: 'Select your target language below • Powered by advanced translation APIs' })
    .setTimestamp();

  await message.reply({ embeds: [embed], components: [row] });
}

export async function handleTranslateInteraction(interaction: StringSelectMenuInteraction) {
  if (!interaction.message.embeds[0]?.description) {
    return interaction.reply({
      content: '❌ Could not find the original text to translate',
      flags: MessageFlags.Ephemeral
    });
  }

  await interaction.deferReply({ flags: MessageFlags.Ephemeral });
  
  const targetLang = interaction.values[0];
  const description = interaction.message.embeds[0].description;
  const textMatch = description.match(/\*\*Original Text:\*\*\n```\n([\s\S]*?)\n```/);
  const originalText = textMatch ? textMatch[1] : description.replace('**Original Text:**\n', '');
  
  const langData = LANGUAGES.find(l => l.code === targetLang);

  if (!langData) {
    return interaction.editReply('❌ Invalid language selected');
  }

  try {
    let translatedText = '';
    let serviceUsed = '';
    
    // Translation logic remains the same...
    // First try: LibreTranslate
    try {
      const response = await axios.post('https://libretranslate.com/translate', {
        q: originalText,
        source: 'auto',
        target: targetLang
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 8000
      });
      
      if (response.data?.translatedText) {
        translatedText = response.data.translatedText;
        serviceUsed = 'LibreTranslate';
      }
    } catch (libreError) {
      console.log('LibreTranslate failed, trying alternative...');
    }

    // Fallback: Google Translate
    if (!translatedText) {
      try {
        const response = await axios.get(`https://translate.googleapis.com/translate_a/single`, {
          params: {
            client: 'gtx',
            sl: 'auto',
            tl: targetLang,
            dt: 't',
            q: originalText
          },
          timeout: 8000
        });
        
        if (response.data && response.data[0] && response.data[0][0]) {
          translatedText = response.data[0][0];
          serviceUsed = 'Google Translate';
        }
      } catch (googleError) {
        console.log('Google Translate also failed');
      }
    }

    if (!translatedText) {
      throw new Error('All translation services unavailable');
    }

    // Create copy button
    const copyButton = new ButtonBuilder()
      .setCustomId(`copy_translation_${Date.now()}`)
      .setLabel('📋 Copy Translation')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('📋');

    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(copyButton);

    // Improved embed with clear Before/After format
    const resultEmbed = new EmbedBuilder()
      .setTitle(`${langData.emoji} Translation Complete`)
      .addFields([
        {
          name: `📝 Before (Original)`,
          value: `\`\`\`\n${originalText}\n\`\`\``,
          inline: false
        },
        {
          name: `🌍 After (${langData.native})`,
          value: `\`\`\`\n${translatedText}\n\`\`\``,
          inline: false
        }
      ])
      .addFields([
        { name: '🌍 Language', value: `${langData.emoji} ${langData.name} (${langData.native})`, inline: true },
        { name: '⚡ Service', value: serviceUsed, inline: true },
        { name: '📊 Length', value: `${translatedText.length} characters`, inline: true }
      ])
      .setColor(0x2ecc71)
      .setFooter({ text: `Translation completed • ${serviceUsed} • ${new Date().toLocaleTimeString()}` })
      .setTimestamp();

    await interaction.editReply({ 
      embeds: [resultEmbed],
      components: [row]
    });
  } catch (error) {
    console.error('Translation failed:', error);
    
    const errorEmbed = new EmbedBuilder()
      .setTitle('❌ Translation Failed')
      .setDescription('Unable to translate your text at this time.')
      .addFields([
        { name: '🔧 Possible Causes', value: '• Translation services temporarily unavailable\n• Network connectivity issues\n• Text format not supported', inline: false },
        { name: '💡 Suggestions', value: '• Try again in a few minutes\n• Check your text format\n• Use shorter text if possible', inline: false }
      ])
      .setColor(0xe74c3c)
      .setFooter({ text: 'Please try again later' })
      .setTimestamp();

    await interaction.editReply({
      embeds: [errorEmbed]
    });
  }
}

// Update the copy handler with proper typing
export async function handleCopyTranslation(interaction: any) {
  if (!interaction.isButton()) return;
  if (!interaction.customId.startsWith('copy_translation_')) return;

  try {
    const embed = interaction.message.embeds[0];
    
    // Find the "After" field which contains the translation
    const afterField = embed.fields.find((field: EmbedField) => field.name.includes('After'));
    const translationText = afterField ? afterField.value.replace(/```\n?|\n?```/g, '') : 'Translation not found';

    await interaction.reply({
      content: `📋 **Translation copied!**\n\`\`\`\n${translationText}\n\`\`\``,
      flags: MessageFlags.Ephemeral
    });
  } catch (error) {
    console.error('Copy translation error:', error);
    await interaction.reply({
      content: '❌ Failed to copy translation',
      flags: MessageFlags.Ephemeral
    });
  }
}
