


export const data = {
  name: 'calculator',
  description: 'Perform mathematical calculations',
  category: CommandCategory.UTILITY,
  usage: '!calculator <expression>',
  aliases: ['calc', 'math'],
  cooldown: 5
};

export const slashData = new SlashCommandBuilder()
  .setName('calculator')
  .setDescription('Perform mathematical calculations')
  .addStringOption(option =>
    option.setName('expression')
      .setDescription('Mathematical expression to calculate')
      .setRequired(true)
  );

function evaluateExpression(expression: string): { result: number; error?: string } {
  try {
    // Remove all spaces and convert to lowercase
    const cleanExpr = expression.replace(/\s/g, '').toLowerCase();
    
    // Validate expression contains only allowed characters
    if (!/^[0-9+\-*/().\s]+$/.test(cleanExpr)) {
      return { result: 0, error: 'Invalid characters in expression. Only numbers, +, -, *, /, (, ) are allowed.' };
    }
    
    // Replace mathematical operators with JavaScript equivalents
    let jsExpr = cleanExpr
      .replace(/\*/g, '*')
      .replace(/\//g, '/')
      .replace(/\+/g, '+')
      .replace(/-/g, '-');
    
    // Evaluate the expression
    const result = eval(jsExpr);
    
    if (typeof result !== 'number' || !isFinite(result)) {
      return { result: 0, error: 'Invalid mathematical expression.' };
    }
    
    return { result };
  } catch (error) {
    return { result: 0, error: 'Invalid mathematical expression.' };
  }
}

function formatNumber(num: number): string {
  if (Number.isInteger(num)) {
    return num.toString();
  }
  return num.toFixed(6).replace(/\.?0+$/, '');
}

export async function execute(message: Message, args?: string[]) {
  if (!args || args.length === 0) {
    await message.reply('❌ Please provide a mathematical expression! Usage: `!calculator <expression>`');
    return;
  }
  
  const expression = args.join(' ');
  const { result, error } = evaluateExpression(expression);
  
  if (error) {
    await message.reply(`❌ ${error}`);
    return;
  }
  
  const embed = new EmbedBuilder()
    .setTitle('🧮 Calculator')
    .setDescription(`**Expression:** \`${expression}\``)
    .setColor(0x4CAF50)
    .addFields([
      { name: '📊 Result', value: `\`${formatNumber(result)}\``, inline: true },
      { name: '🔢 Type', value: Number.isInteger(result) ? 'Integer' : 'Decimal', inline: true }
    ])
    .setFooter({ text: 'Supports: +, -, *, /, parentheses' })
    .setTimestamp();
  
  await message.reply({ embeds: [embed] });
}

export async function executeSlash(interaction: ChatInputCommandInteraction) {
  const expression = interaction.options.getString('expression')!;
  const { result, error } = evaluateExpression(expression);
  
  if (error) {
    await interaction.reply({ content: `❌ ${error}`, ephemeral: true });
    return;
  }
  
  const embed = new EmbedBuilder()
    .setTitle('🧮 Calculator')
    .setDescription(`**Expression:** \`${expression}\``)
    .setColor(0x4CAF50)
    .addFields([
      { name: '📊 Result', value: `\`${formatNumber(result)}\``, inline: true },
      { name: '🔢 Type', value: Number.isInteger(result) ? 'Integer' : 'Decimal', inline: true }
    ])
    .setFooter({ text: 'Supports: +, -, *, /, parentheses' })
    .setTimestamp();
  
  await interaction.reply({ embeds: [embed] });
} 
