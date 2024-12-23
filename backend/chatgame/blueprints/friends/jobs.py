from datetime import datetime

from sqlalchemy import delete

from chatgame.db.models import FriendRequestModel
from chatgame.extensions import scheduler, db

@scheduler.task("interval", id="delete_expired_friend_requests", minutes=30, next_run_time=datetime.now())
def delete_expired_friend_requests():
    now = datetime.now()

    stmt = delete(FriendRequestModel).where(now > FriendRequestModel.expires_at)

    with scheduler.app.app_context():
        db.session.execute(stmt)
        db.session.commit()

        scheduler.app.logger.info("Expired or answered FriendRequests deleted.")