from datetime import datetime
from uuid import UUID

from sqlalchemy import ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from chatgame.constants import RequestStatus, Game
from chatgame.extensions import db


class InviteModel(db.Model):
    __tablename__ = "invite"

    id: Mapped[int] = mapped_column(primary_key=True)
    status: Mapped[RequestStatus] = mapped_column(Enum(RequestStatus), default=RequestStatus.PENDING)
    game: Mapped[Game] = mapped_column(Enum(Game))

    sender_socket_id: Mapped[str]
    sender_user_id: Mapped[UUID] = mapped_column(ForeignKey("user.id"), nullable=True)
    sender: Mapped["UserModel"] = relationship(back_populates="sent_invites", foreign_keys=[sender_user_id])

    receiver_socket_id: Mapped[str] = mapped_column(nullable=True)
    receiver_user_id: Mapped[UUID] = mapped_column(ForeignKey("user.id"), nullable=True)
    receiver: Mapped["UserModel"] = relationship(back_populates="received_invites", foreign_keys=[receiver_user_id])

    created_at: Mapped[datetime] = mapped_column(default=datetime.now())
