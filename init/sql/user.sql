CREATE TABLE   IF NOT EXISTS  `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `phone` int(11) DEFAULT NULL,
  `nickName` varchar(255) DEFAULT NULL,
  `gender` int(1) DEFAULT NULL,
  `language` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `province` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `avatarUrl` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `detail_info` varchar(255) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
	`openid` varchar(40) DEFAULT NULL,
	`unionid` varchar(40) DEFAULT NULL,
  `create_time` varchar(20) DEFAULT NULL,
  `modified_time` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE   IF NOT EXISTS  `login` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
	`session_key` varchar(255) DEFAULT NULL,
	`openid` varchar(40) DEFAULT NULL,
	`token` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;