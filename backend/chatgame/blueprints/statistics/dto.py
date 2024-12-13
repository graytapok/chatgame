from chatgame.db.dto import TotalStatisticsDto, UserDto


class LeaderboardUserDto(UserDto):
    statistics: TotalStatisticsDto