from flask_socketio import SocketIO

from . import tictactoe_plus, chat, tictactoe, friends

def register_sockets(socketio: SocketIO):
    socketio.on_namespace(chat.Socket(namespace="/chat"))
    socketio.on_namespace(friends.Socket(namespace="/friends"))
    socketio.on_namespace(tictactoe.Socket(namespace="/tictactoe"))
    socketio.on_namespace(tictactoe_plus.Socket(namespace="/tictactoe_plus"))