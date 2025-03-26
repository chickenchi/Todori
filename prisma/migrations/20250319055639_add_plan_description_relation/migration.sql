-- CreateTable
CREATE TABLE `plan` (
    `pid` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(100) NOT NULL,
    `planType` ENUM('routine', 'project', 'common') NOT NULL,
    `deadline` DATETIME(0) NOT NULL,
    `ETC` VARCHAR(10) NULL,
    `difficulty` INTEGER NULL,
    `penalty` TEXT NULL,
    `reward` TEXT NULL,
    `completed` BOOLEAN NOT NULL,
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
