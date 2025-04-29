import telebot
bot = telebot.TeleBot(<your token>)


@bot.message_handler(commands=['start'])
def start_command(message):
    keyboard = telebot.types.ReplyKeyboardMarkup(row_width=2, resize_keyboard=True)
    button1 = telebot.types.KeyboardButton('ДА')
    button2 = telebot.types.KeyboardButton('Нет')
    keyboard.add(button1, button2)
    bot.send_message(message.chat.id, "Хотите пикчу с котиком?", reply_markup=keyboard)

@bot.message_handler(content_types=['text'])
def handle_text(message):
    if(message.text == 'ДА'):
        photo = open('<your path>.jpg', 'rb')
        bot.send_photo(message.chat.id, photo)
    elif(message.text == 'Нет'):
        bot.send_message(message.chat.id, "идите нафиг")
        photo = open('<your path>.jpg', 'rb')
        bot.send_photo(message.chat.id, photo)
bot.infinity_polling()
