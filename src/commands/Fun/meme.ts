


export const data = {
  name: 'meme',
  description: 'Get a random meme to brighten your day!',
  aliases: ['memes', 'funny'],
  category: CommandCategory.FUN,
  usage: '!meme',
  cooldown: 3
};

export const slashData = new SlashCommandBuilder()
  .setName('meme')
  .setDescription('Get a random meme to brighten your day!');

const memes = [
  {
    title: "When you find a bug in production",
    url: "https://i.imgflip.com/2/1bij.jpg",
    description: "This is fine... everything is fine."
  },
  {
    title: "When someone asks if you've tested your code",
    url: "https://i.imgflip.com/2/1ihzfe.jpg", 
    description: "It works on my machine! 🤷‍♂️"
  },
  {
    title: "Me explaining my code to other developers",
    url: "https://i.imgflip.com/2/23ls.jpg",
    description: "Charlie Day conspiracy theory meme intensifies"
  },
  {
    title: "When the client asks for 'just a small change'",
    url: "https://i.imgflip.com/2/2fm6x.jpg",
    description: "One does not simply... make small changes"
  },
  {
    title: "When you fix one bug and create three more",
    url: "https://i.imgflip.com/2/61kd3.jpg",
    description: "Drake pointing meme: Creating bugs ✅"
  }
];

const textMemes = [
  {
    title: "Programming Logic",
    text: "99 little bugs in the code,\n99 little bugs,\nTake one down, patch it around,\n117 little bugs in the code."
  },
  {
    title: "Developer's Dilemma", 
    text: "There are only 10 types of people in the world:\nThose who understand binary and those who don't."
  },
  {
    title: "The Truth About Comments",
    text: "// This code was written by a genius\n// Good luck trying to understand it\n// - Future me"
  },
  {
    title: "Programming Haiku",
    text: "It's not a bug, it's\nAn undocumented feature\nThat's what I tell boss"
  },
  {
    title: "Coffee.exe",
    text: "Error 404: Coffee not found\nCannot compile human\nPlease insert caffeine and try again"
  },
  {
    title: "Git Commit Messages",
    text: "git commit -m 'fixed stuff'\ngit commit -m 'fixed the fix'\ngit commit -m 'this should work now'\ngit commit -m 'seriously this time'"
  },
  {
    title: "The Rubber Duck",
    text: "Me: *explains problem to rubber duck for 20 minutes*\nAlso me: *suddenly realizes the solution*\nRubber duck: 🦆"
  },
  {
    title: "Stack Overflow Mood",
    text: "Problem: Exists\nMe: Copy paste from Stack Overflow\nProblem: Still exists\nMe: 😭"
  }
];

export async function execute(message: Message) {
  // Randomly choose between image memes and text memes
  const useImageMeme = Math.random() > 0.4; // 60% chance for image memes
  
  if (useImageMeme && memes.length > 0) {
    const randomMeme = memes[Math.floor(Math.random() * memes.length)];
    
    const embed = new EmbedBuilder()
      .setTitle(`😂 ${randomMeme.title}`)
      .setDescription(randomMeme.description)
      .setImage(randomMeme.url)
      .setColor(0xff6b6b)
      .setFooter({ 
        text: `Meme ${Math.floor(Math.random() * 1000) + 1} • Enjoy the laughs!`,
        iconURL: message.author.displayAvatarURL()
      });

    await message.reply({ embeds: [embed] });
  } else {
    const randomTextMeme = textMemes[Math.floor(Math.random() * textMemes.length)];
    
    const embed = new EmbedBuilder()
      .setTitle(`😂 ${randomTextMeme.title}`)
      .setDescription(`\`\`\`\n${randomTextMeme.text}\n\`\`\``)
      .setColor(0xff6b6b)
      .setThumbnail('https://cdn.discordapp.com/emojis/869654102687490058.png') // Laughing emoji
      .setFooter({ 
        text: `Text Meme #${Math.floor(Math.random() * 100) + 1} • Hope this made you smile!`,
        iconURL: message.author.displayAvatarURL()
      });

    await message.reply({ embeds: [embed] });
  }
}

export async function executeSlash(interaction: ChatInputCommandInteraction) {
  // Randomly choose between image memes and text memes
  const useImageMeme = Math.random() > 0.4; // 60% chance for image memes
  
  if (useImageMeme && memes.length > 0) {
    const randomMeme = memes[Math.floor(Math.random() * memes.length)];
    
    const embed = new EmbedBuilder()
      .setTitle(`😂 ${randomMeme.title}`)
      .setDescription(randomMeme.description)
      .setImage(randomMeme.url)
      .setColor(0xff6b6b)
      .setFooter({ 
        text: `Meme ${Math.floor(Math.random() * 1000) + 1} • Enjoy the laughs!`,
        iconURL: interaction.user.displayAvatarURL()
      });

    await interaction.reply({ embeds: [embed] });
  } else {
    const randomTextMeme = textMemes[Math.floor(Math.random() * textMemes.length)];
    
    const embed = new EmbedBuilder()
      .setTitle(`😂 ${randomTextMeme.title}`)
      .setDescription(`\`\`\`\n${randomTextMeme.text}\n\`\`\``)
      .setColor(0xff6b6b)
      .setThumbnail('https://cdn.discordapp.com/emojis/869654102687490058.png') // Laughing emoji
      .setFooter({ 
        text: `Text Meme #${Math.floor(Math.random() * 100) + 1} • Hope this made you smile!`,
        iconURL: interaction.user.displayAvatarURL()
      });

    await interaction.reply({ embeds: [embed] });
  }
} 
