CREATE TABLE   IF NOT EXISTS  `dynamics` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) DEFAULT NULL,
  `type` int(1) DEFAULT NULL,
	`title` varchar(255) DEFAULT NULL,
  `content` varchar(255) DEFAULT NULL,
  `img_url` varchar(255) DEFAULT NULL,
  `video_url` varchar(255) DEFAULT NULL,
  `audio_url` varchar(255) DEFAULT NULL,
  `pictures_url` varchar(255) DEFAULT NULL,
  `open` int(1) DEFAULT 0,
  `create_time` varchar(20) DEFAULT NULL,
  `modified_time` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;