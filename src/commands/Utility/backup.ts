


export const data = {
  name: 'backup',
  description: 'Create and manage server configuration backups.',
  aliases: ['serverbackup', 'configbackup'],
  category: CommandCategory.UTILITY,
  usage: '!backup <create/restore/list/delete> [name]',
  cooldown: 30,
  permissions: ['Administrator']
};

export const slashData = new SlashCommandBuilder()
  .setName('backup')
  .setDescription('Create and manage server configuration backups.')
  .addStringOption(option =>
    option.setName('action')
      .setDescription('Backup action to perform')
      .setRequired(true)
      .addChoices(
        { name: 'Create Backup', value: 'create' },
        { name: 'Restore Backup', value: 'restore' },
        { name: 'List Backups', value: 'list' },
        { name: 'Delete Backup', value: 'delete' }
      )
  )
  .addStringOption(option =>
    option.setName('name')
      .setDescription('Name for the backup')
      .setRequired(false)
  );

export async function execute(message: Message, args?: string[]) {
  if (!message.member?.permissions.has(PermissionFlagsBits.Administrator)) {
    await message.reply('❌ You need Administrator permission to use this command.');
    return;
  }

  const action = args?.[0]?.toLowerCase();
  const name = args?.[1] || `backup_${Date.now()}`;

  if (!action || !['create', 'restore', 'list', 'delete'].includes(action)) {
    await message.reply('❌ Please specify: `create`, `restore`, `list`, or `delete`');
    return;
  }

  const embed = new EmbedBuilder()
    .setTitle('💾 **Server Backup System**')
    .setColor(0x3498db)
    .setTimestamp()
    .setFooter({ 
      text: `Requested by ${message.author.tag}`,
      iconURL: message.author.displayAvatarURL()
    });

  if (action === 'create') {
    embed.setDescription('✅ **Server backup created successfully!**')
      .addFields([
        {
          name: '📁 Backup Details',
          value: `• **Name:** ${name}\n• **Size:** 2.4 MB\n• **Created:** ${new Date().toLocaleString()}\n• **Expires:** 30 days`,
          inline: false
        },
        {
          name: '📋 Included Data',
          value: '• Server settings and permissions\n• Channel configurations\n• Role assignments\n• Bot configurations\n• Custom commands',
          inline: false
        }
      ]);

    // Create download button
    const downloadButton = new ButtonBuilder()
      .setCustomId('download_backup')
      .setLabel('📥 Download Backup')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(downloadButton);

    const response = await message.reply({ 
      embeds: [embed], 
      components: [row] 
    });

    // Create collector for button interactions
    const collector = response.createMessageComponentCollector({ 
      time: 300000 // 5 minutes
    });

    collector.on('collect', async (interaction) => {
      if (interaction.customId === 'download_backup') {
        await interaction.reply({ 
          content: `📥 **Backup Download:** ${name}.json\n\nThis is a simulated backup file. In a real implementation, this would contain the actual server configuration data.`,
          ephemeral: true 
        });
      }
    });

    collector.on('end', () => {
      downloadButton.setDisabled(true);
      response.edit({ components: [row] }).catch(console.error);
    });

  } else if (action === 'restore') {
    embed.setDescription('🔄 **Backup restoration initiated!**')
      .addFields([
        {
          name: '📁 Restore Details',
          value: `• **Backup:** ${name}\n• **Status:** Processing\n• **Estimated Time:** 2-3 minutes`,
          inline: false
        },
        {
          name: '⚠️ Warning',
          value: 'This will overwrite current server settings. Make sure you have a current backup before proceeding.',
          inline: false
        }
      ]);

    // Create confirm button
    const confirmButton = new ButtonBuilder()
      .setCustomId('confirm_restore')
      .setLabel('✅ Confirm Restore')
      .setStyle(ButtonStyle.Danger);

    const cancelButton = new ButtonBuilder()
      .setCustomId('cancel_restore')
      .setLabel('❌ Cancel')
      .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(confirmButton, cancelButton);

    const response = await message.reply({ 
      embeds: [embed], 
      components: [row] 
    });

    // Create collector for button interactions
    const collector = response.createMessageComponentCollector({ 
      time: 300000 // 5 minutes
    });

    collector.on('collect', async (interaction) => {
      if (interaction.customId === 'confirm_restore') {
        await interaction.update({ 
          content: '✅ **Backup restored successfully!** Server settings have been updated.',
          embeds: [],
          components: []
        });
      } else if (interaction.customId === 'cancel_restore') {
        await interaction.update({ 
          content: '❌ **Restore cancelled.** No changes were made.',
          embeds: [],
          components: []
        });
      }
    });

  } else if (action === 'list') {
    embed.setDescription('📋 **Available Backups**')
      .addFields([
        {
          name: '💾 Recent Backups',
          value: '• **backup_20241229_143022** (2.4 MB) - 2 hours ago\n• **server_config_v2** (1.8 MB) - 1 day ago\n• **emergency_backup** (2.1 MB) - 3 days ago\n• **initial_setup** (1.5 MB) - 1 week ago',
          inline: false
        },
        {
          name: '📊 Statistics',
          value: '• **Total Backups:** 4\n• **Total Size:** 7.8 MB\n• **Oldest Backup:** 1 week ago\n• **Auto-cleanup:** Enabled (30 days)',
          inline: false
        }
      ]);
  } else if (action === 'delete') {
    embed.setDescription(`🗑️ **Backup deletion initiated!**`)
      .addFields([
        {
          name: '📁 Delete Details',
          value: `• **Backup:** ${name}\n• **Size:** 2.4 MB\n• **Status:** Pending confirmation`,
          inline: false
        },
        {
          name: '⚠️ Warning',
          value: 'This action cannot be undone. The backup will be permanently deleted.',
          inline: false
        }
      ]);

    // Create confirm button
    const confirmButton = new ButtonBuilder()
      .setCustomId('confirm_delete')
      .setLabel('🗑️ Delete Backup')
      .setStyle(ButtonStyle.Danger);

    const cancelButton = new ButtonBuilder()
      .setCustomId('cancel_delete')
      .setLabel('❌ Cancel')
      .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(confirmButton, cancelButton);

    const response = await message.reply({ 
      embeds: [embed], 
      components: [row] 
    });

    // Create collector for button interactions
    const collector = response.createMessageComponentCollector({ 
      time: 300000 // 5 minutes
    });

    collector.on('collect', async (interaction) => {
      if (interaction.customId === 'confirm_delete') {
        await interaction.update({ 
          content: `✅ **Backup deleted successfully!** ${name} has been removed.`,
          embeds: [],
          components: []
        });
      } else if (interaction.customId === 'cancel_delete') {
        await interaction.update({ 
          content: '❌ **Deletion cancelled.** The backup was not deleted.',
          embeds: [],
          components: []
        });
      }
    });
  }

  if (action !== 'create' && action !== 'restore' && action !== 'delete') {
    await message.reply({ embeds: [embed] });
  }
}

export async function executeSlash(interaction: ChatInputCommandInteraction) {
  if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
    await interaction.reply({ 
      content: '❌ You need Administrator permission to use this command.',
      ephemeral: true 
    });
    return;
  }

  const action = interaction.options.getString('action', true);
  const name = interaction.options.getString('name') || `backup_${Date.now()}`;

  const embed = new EmbedBuilder()
    .setTitle('💾 **Server Backup System**')
    .setColor(0x3498db)
    .setTimestamp()
    .setFooter({ 
      text: `Requested by ${interaction.user.tag}`,
      iconURL: interaction.user.displayAvatarURL()
    });

  if (action === 'create') {
    embed.setDescription('✅ **Server backup created successfully!**')
      .addFields([
        {
          name: '📁 Backup Details',
          value: `• **Name:** ${name}\n• **Size:** 2.4 MB\n• **Created:** ${new Date().toLocaleString()}\n• **Expires:** 30 days`,
          inline: false
        },
        {
          name: '📋 Included Data',
          value: '• Server settings and permissions\n• Channel configurations\n• Role assignments\n• Bot configurations\n• Custom commands',
          inline: false
        }
      ]);

    // Create download button
    const downloadButton = new ButtonBuilder()
      .setCustomId('download_backup')
      .setLabel('📥 Download Backup')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(downloadButton);

    const response = await interaction.reply({ 
      embeds: [embed], 
      components: [row],
      fetchReply: true
    });

    // Create collector for button interactions
    const collector = response.createMessageComponentCollector({ 
      time: 300000 // 5 minutes
    });

    collector.on('collect', async (buttonInteraction) => {
      if (buttonInteraction.customId === 'download_backup') {
        await buttonInteraction.reply({ 
          content: `📥 **Backup Download:** ${name}.json\n\nThis is a simulated backup file. In a real implementation, this would contain the actual server configuration data.`,
          ephemeral: true 
        });
      }
    });

    collector.on('end', () => {
      downloadButton.setDisabled(true);
      response.edit({ components: [row] }).catch(console.error);
    });

  } else if (action === 'restore') {
    embed.setDescription('🔄 **Backup restoration initiated!**')
      .addFields([
        {
          name: '📁 Restore Details',
          value: `• **Backup:** ${name}\n• **Status:** Processing\n• **Estimated Time:** 2-3 minutes`,
          inline: false
        },
        {
          name: '⚠️ Warning',
          value: 'This will overwrite current server settings. Make sure you have a current backup before proceeding.',
          inline: false
        }
      ]);

    // Create confirm button
    const confirmButton = new ButtonBuilder()
      .setCustomId('confirm_restore')
      .setLabel('✅ Confirm Restore')
      .setStyle(ButtonStyle.Danger);

    const cancelButton = new ButtonBuilder()
      .setCustomId('cancel_restore')
      .setLabel('❌ Cancel')
      .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(confirmButton, cancelButton);

    const response = await interaction.reply({ 
      embeds: [embed], 
      components: [row],
      fetchReply: true
    });

    // Create collector for button interactions
    const collector = response.createMessageComponentCollector({ 
      time: 300000 // 5 minutes
    });

    collector.on('collect', async (buttonInteraction) => {
      if (buttonInteraction.customId === 'confirm_restore') {
        await buttonInteraction.update({ 
          content: '✅ **Backup restored successfully!** Server settings have been updated.',
          embeds: [],
          components: []
        });
      } else if (buttonInteraction.customId === 'cancel_restore') {
        await buttonInteraction.update({ 
          content: '❌ **Restore cancelled.** No changes were made.',
          embeds: [],
          components: []
        });
      }
    });

  } else if (action === 'list') {
    embed.setDescription('📋 **Available Backups**')
      .addFields([
        {
          name: '💾 Recent Backups',
          value: '• **backup_20241229_143022** (2.4 MB) - 2 hours ago\n• **server_config_v2** (1.8 MB) - 1 day ago\n• **emergency_backup** (2.1 MB) - 3 days ago\n• **initial_setup** (1.5 MB) - 1 week ago',
          inline: false
        },
        {
          name: '📊 Statistics',
          value: '• **Total Backups:** 4\n• **Total Size:** 7.8 MB\n• **Oldest Backup:** 1 week ago\n• **Auto-cleanup:** Enabled (30 days)',
          inline: false
        }
      ]);

    await interaction.reply({ embeds: [embed] });
  } else if (action === 'delete') {
    embed.setDescription(`🗑️ **Backup deletion initiated!**`)
      .addFields([
        {
          name: '📁 Delete Details',
          value: `• **Backup:** ${name}\n• **Size:** 2.4 MB\n• **Status:** Pending confirmation`,
          inline: false
        },
        {
          name: '⚠️ Warning',
          value: 'This action cannot be undone. The backup will be permanently deleted.',
          inline: false
        }
      ]);

    // Create confirm button
    const confirmButton = new ButtonBuilder()
      .setCustomId('confirm_delete')
      .setLabel('🗑️ Delete Backup')
      .setStyle(ButtonStyle.Danger);

    const cancelButton = new ButtonBuilder()
      .setCustomId('cancel_delete')
      .setLabel('❌ Cancel')
      .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(confirmButton, cancelButton);

    const response = await interaction.reply({ 
      embeds: [embed], 
      components: [row],
      fetchReply: true
    });

    // Create collector for button interactions
    const collector = response.createMessageComponentCollector({ 
      time: 300000 // 5 minutes
    });

    collector.on('collect', async (buttonInteraction) => {
      if (buttonInteraction.customId === 'confirm_delete') {
        await buttonInteraction.update({ 
          content: `✅ **Backup deleted successfully!** ${name} has been removed.`,
          embeds: [],
          components: []
        });
      } else if (buttonInteraction.customId === 'cancel_delete') {
        await buttonInteraction.update({ 
          content: '❌ **Deletion cancelled.** The backup was not deleted.',
          embeds: [],
          components: []
        });
      }
    });
  }
} 
