
const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const mongoose = require('mongoose');
const axios = require('axios');
const app = express();
const port = 3000;

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const userSchema = new mongoose.Schema({
  userId: String,
  userName: String,
  userNumber: String,
});

const chatSchema = new mongoose.Schema({
  chatId: String,
  messages: [{
    body: String,
    date: Date,
    direction: String,
    senderName: String,
    senderId: String
  }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const User = mongoose.model('User', userSchema);
const Chat = mongoose.model('Chat', chatSchema);

const client = new Client({
  authStrategy: new LocalAuth()
});

client.on('qr', (qr) => console.log('QR RECEIVED', qr));
client.on('ready', () => {
  console.log('Client is ready!');
});
client.initialize();

app.post('/recebeMensagem', async (req, res) => {
  const { message, from } = req.body;
  let user = await User.findOne({ userNumber: from });
  if (!user) {
    user = new User({ userNumber: from, userName: "Unknown" });
    await user.save();
  }

  const chat = new Chat({
    messages: [{
      body: message,
      date: new Date(),
      direction: 'incoming',
      senderName: user.userName,
      senderId: user._id
    }],
    userId: user._id
  });
  await chat.save();

  const history = await Chat.find({ userId: user._id }).populate('messages');

  try {
    const response = await axios.post(process.env.POWER_AUTOMATE_URL, {
      chatId: chat._id.toString(),
      message,
      from: user.userName,
      history
    });
    res.json({ message: 'Data and history sent to Power Automate', response: response.data });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send data to Power Automate', error: error.message });
  }
});

app.post('/resposta', async (req, res) => {
  const { chatId, message, senderName, senderId } = req.body;
  const chat = await Chat.findById(chatId);
  chat.messages.push({
    body: message,
    date: new Date(),
    direction: 'outgoing',
    senderName,
    senderId
  });
  await chat.save();

  const whatsappMessage = await client.sendMessage(chat.userId.userNumber, message);
  res.send('Response sent to WhatsApp');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
