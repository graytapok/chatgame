from datetime import datetime, timedelta
from uuid import UUID

from sqlalchemy import ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from chatgame.config import config
from chatgame.constants import FriendRequestStatus
from chatgame.extensions import db


class FriendRequestModel(db.Model):
    __tablename__ = "friend_request"

    id: Mapped[int] = mapped_column(primary_key=True)

    status: Mapped[FriendRequestStatus] = mapped_column(Enum(FriendRequestStatus), default=FriendRequestStatus.PENDING, nullable=False)

    sender_id: Mapped[UUID] = mapped_column(ForeignKey("user.id"), nullable=False)
    sender: Mapped["UserModel"] = relationship(back_populates="sent_friend_requests", foreign_keys=[sender_id])

    receiver_id: Mapped[UUID] = mapped_column(ForeignKey("user.id"), nullable=False)
    receiver: Mapped["UserModel"] = relationship(back_populates="received_friend_requests", foreign_keys=[receiver_id])

    send_at: Mapped[datetime] = mapped_column(default=datetime.now())
    expires_at: Mapped[datetime] = mapped_column(default=datetime.now() + timedelta(minutes=config.FRIEND_REQUEST_EXPIRATION_IN_MINUTES))

    def __init__(self, sender_id: UUID, receiver_id: UUID):
        self.sender_id = sender_id
        self.receiver_id = receiver_id
