from chatgame import create_app
from chatgame.extensions import socketio

app = create_app()

if __name__ == "__main__":
    socketio.run(app)
