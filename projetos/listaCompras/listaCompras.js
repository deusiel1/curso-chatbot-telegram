const env = require('../../.env')
const Telegraf = require('telegraf')
const session = require('telegraf/session')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const bot = new Telegraf(env.token)

bot.use(session())

const gerarBotoes = (lista) => Extra.markup(
    Markup.inlineKeyboard(
        lista.map(item => Markup.callbackButton(item, `delete ${item}`)),
        { columns: 3 }
    )
)

bot.start(async ctx => {
    ctx.session.lista = []
    const name = ctx.update.message.from.first_name
    await ctx.reply(`Seja bem vindo, ${name}!`)
    await ctx.reply('Escreva os itens que você deseja adicionar...')
})

bot.on('text', ctx => {
    if (!ctx.session.lista) {
        ctx.session.lista = []
    }
    ctx.session.lista.push(ctx.update.message.text)
    ctx.reply(`${ctx.update.message.text} adicionado!`, gerarBotoes(ctx.session.lista))
})

bot.action(/delete (.+)/, ctx => {
    if (!ctx.session.lista) {
        ctx.session.lista = []
    }
    ctx.session.lista = ctx.session.lista.filter(item => item !== ctx.match[1])
    ctx.reply(`${ctx.match[1]} deletado!`, gerarBotoes(ctx.session.lista))
})

bot.startPolling()