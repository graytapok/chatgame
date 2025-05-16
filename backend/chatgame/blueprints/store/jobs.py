from datetime import datetime

from sqlalchemy import delete

from chatgame.db.models import PaymentModel
from chatgame.extensions import db, scheduler


@scheduler.task("interval", id="delete_expired_payments", minutes=60, next_run_time=datetime.now())
def delete_expired_payments():
    now = datetime.now()

    stmt = delete(PaymentModel).where(now > PaymentModel.expires_at)

    with scheduler.app.app_context():
        db.session.execute(stmt)
        db.session.commit()

        scheduler.app.logger.info("Expired Payments deleted.")