


export const data = {
  name: 'translate',
  description: 'Translate text between different languages',
  category: CommandCategory.GENERAL,
  usage: '!translate <text> [target_language]',
  aliases: ['tr', 'trans'],
  cooldown: 10
};

export const slashData = new SlashCommandBuilder()
  .setName('translate')
  .setDescription('Translate text between different languages')
  .addStringOption(option =>
    option.setName('text')
      .setDescription('Text to translate')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('target')
      .setDescription('Target language (default: English)')
      .setRequired(false)
  );

const languages = {
  'english': { code: 'en', flag: '🇺🇸', name: 'English' },
  'spanish': { code: 'es', flag: '🇪🇸', name: 'Spanish' },
  'french': { code: 'fr', flag: '🇫🇷', name: 'French' },
  'german': { code: 'de', flag: '🇩🇪', name: 'German' },
  'italian': { code: 'it', flag: '🇮🇹', name: 'Italian' },
  'portuguese': { code: 'pt', flag: '🇵🇹', name: 'Portuguese' },
  'russian': { code: 'ru', flag: '🇷🇺', name: 'Russian' },
  'japanese': { code: 'ja', flag: '🇯🇵', name: 'Japanese' },
  'korean': { code: 'ko', flag: '🇰🇷', name: 'Korean' },
  'chinese': { code: 'zh', flag: '🇨🇳', name: 'Chinese' },
  'arabic': { code: 'ar', flag: '🇸🇦', name: 'Arabic' },
  'hindi': { code: 'hi', flag: '🇮🇳', name: 'Hindi' },
  'dutch': { code: 'nl', flag: '🇳🇱', name: 'Dutch' },
  'swedish': { code: 'sv', flag: '🇸🇪', name: 'Swedish' },
  'norwegian': { code: 'no', flag: '🇳🇴', name: 'Norwegian' },
  'danish': { code: 'da', flag: '🇩🇰', name: 'Danish' },
  'finnish': { code: 'fi', flag: '🇫🇮', name: 'Finnish' },
  'polish': { code: 'pl', flag: '🇵🇱', name: 'Polish' },
  'czech': { code: 'cs', flag: '🇨🇿', name: 'Czech' },
  'hungarian': { code: 'hu', flag: '🇭🇺', name: 'Hungarian' }
};

// Mock translation function (in a real implementation, you'd use a translation API)
function mockTranslate(text: string, targetLang: string): string {
  const target = languages[targetLang.toLowerCase() as keyof typeof languages];
  if (!target) return text;
  
  // Simple mock translations for demonstration
  const mockTranslations: { [key: string]: { [key: string]: string } } = {
    'hello': {
      'es': 'hola',
      'fr': 'bonjour',
      'de': 'hallo',
      'it': 'ciao',
      'pt': 'olá',
      'ru': 'привет',
      'ja': 'こんにちは',
      'ko': '안녕하세요',
      'zh': '你好',
      'ar': 'مرحبا',
      'hi': 'नमस्ते',
      'nl': 'hallo',
      'sv': 'hej',
      'no': 'hei',
      'da': 'hej',
      'fi': 'hei',
      'pl': 'cześć',
      'cs': 'ahoj',
      'hu': 'szia'
    },
    'goodbye': {
      'es': 'adiós',
      'fr': 'au revoir',
      'de': 'auf wiedersehen',
      'it': 'arrivederci',
      'pt': 'adeus',
      'ru': 'до свидания',
      'ja': 'さようなら',
      'ko': '안녕히 가세요',
      'zh': '再见',
      'ar': 'وداعا',
      'hi': 'अलविदा',
      'nl': 'tot ziens',
      'sv': 'hej då',
      'no': 'ha det',
      'da': 'farvel',
      'fi': 'näkemiin',
      'pl': 'do widzenia',
      'cs': 'na shledanou',
      'hu': 'viszlát'
    }
  };
  
  const lowerText = text.toLowerCase();
  if (mockTranslations[lowerText] && mockTranslations[lowerText][target.code]) {
    return mockTranslations[lowerText][target.code];
  }
  
  // For other words, just add some mock translation markers
  return `[${target.name} translation of: ${text}]`;
}

function detectLanguage(text: string): string {
  // Simple language detection based on character sets
  if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) return 'Japanese';
  if (/[\uAC00-\uD7AF]/.test(text)) return 'Korean';
  if (/[\u4E00-\u9FFF]/.test(text)) return 'Chinese';
  if (/[\u0600-\u06FF]/.test(text)) return 'Arabic';
  if (/[\u0900-\u097F]/.test(text)) return 'Hindi';
  if (/[\u0400-\u04FF]/.test(text)) return 'Russian';
  
  // For Latin-based languages, we'll assume English for simplicity
  return 'English';
}

export async function execute(message: Message, args?: string[]) {
  if (!args || args.length === 0) {
    await message.reply('❌ Please provide text to translate! Usage: `!translate <text> [target_language]`');
    return;
  }
  
  const targetLang = args[args.length - 1].toLowerCase();
  let text: string;
  let language: string;
  
  // Check if the last argument is a valid language
  if (languages[targetLang as keyof typeof languages]) {
    text = args.slice(0, -1).join(' ');
    language = targetLang;
  } else {
    text = args.join(' ');
    language = 'english';
  }
  
  if (!text) {
    await message.reply('❌ Please provide text to translate!');
    return;
  }
  
  const detectedLang = detectLanguage(text);
  const translation = mockTranslate(text, language);
  
  const embed = new EmbedBuilder()
    .setTitle('🌐 Translation')
    .setColor(0x2196F3)
    .addFields([
      { name: '📝 Original Text', value: text, inline: false },
      { name: '🔍 Detected Language', value: detectedLang, inline: true },
      { name: '🎯 Target Language', value: languages[language as keyof typeof languages]?.name || 'English', inline: true },
      { name: '📄 Translation', value: translation, inline: false }
    ])
    .setFooter({ text: 'Note: This is a mock translation. For real translations, use a translation API.' })
    .setTimestamp();
  
  await message.reply({ embeds: [embed] });
}

export async function executeSlash(interaction: ChatInputCommandInteraction) {
  const text = interaction.options.getString('text')!;
  const targetLang = interaction.options.getString('target')?.toLowerCase() || 'english';
  
  if (!languages[targetLang as keyof typeof languages]) {
    await interaction.reply({ content: '❌ Invalid target language!', ephemeral: true });
    return;
  }
  
  const detectedLang = detectLanguage(text);
  const translation = mockTranslate(text, targetLang);
  
  const embed = new EmbedBuilder()
    .setTitle('🌐 Translation')
    .setColor(0x2196F3)
    .addFields([
      { name: '📝 Original Text', value: text, inline: false },
      { name: '🔍 Detected Language', value: detectedLang, inline: true },
      { name: '🎯 Target Language', value: languages[targetLang as keyof typeof languages]?.name || 'English', inline: true },
      { name: '📄 Translation', value: translation, inline: false }
    ])
    .setFooter({ text: 'Note: This is a mock translation. For real translations, use a translation API.' })
    .setTimestamp();
  
  await interaction.reply({ embeds: [embed] });
} 
