-- CreateTable
CREATE TABLE `plan` (
    `pid` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(100) NOT NULL,
    `deadline` DATETIME(0) NULL,
    `started` BOOLEAN NOT NULL,
    `startTime` DATETIME(0) NOT NULL,
    `completed` BOOLEAN NOT NULL,
    `ETC` VARCHAR(5) NULL,
    `difficulty` INTEGER NULL,
    `reward` TEXT NULL,
    `penalty` TEXT NULL,
    `note` TEXT NULL,
    `planType` ENUM('routine', 'periodicity', 'project', 'common') NOT NULL,
    `periodicType` ENUM('week', 'interval', 'alternate') NULL,
    `days` TEXT NULL,
    `interval` TEXT NULL,
    `alternative` TEXT NULL,
    `descType` ENUM('procedure', 'supplies', 'range', 'text') NOT NULL,

    PRIMARY KEY (`pid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `plandescription` (
    `pid` INTEGER NOT NULL,
    `pdescId` INTEGER NOT NULL AUTO_INCREMENT,
    `description` TEXT NOT NULL,
    `seq` INTEGER NULL,
    `completed` BOOLEAN NOT NULL,

    INDEX `plandescription_pid_idx`(`pid`),
    PRIMARY KEY (`pdescId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `plandescription` ADD CONSTRAINT `plandescription_pid_fkey` FOREIGN KEY (`pid`) REFERENCES `plan`(`pid`) ON DELETE RESTRICT ON UPDATE CASCADE;
