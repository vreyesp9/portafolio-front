CREATE TABLE `Pais` (
  `id` integer PRIMARY KEY,
  `nombre_pais` varchar(255)
);

CREATE TABLE `Region` (
  `id` integer PRIMARY KEY,
  `nombre_region` varchar(255),
  `pais_id` integer
);

CREATE TABLE `Ciudad` (
  `id` integer PRIMARY KEY,
  `nombre_ciudad` varchar(255),
  `region_id` integer
);

CREATE TABLE `Comuna` (
  `id` integer PRIMARY KEY,
  `nombre_comuna` varchar(255),
  `ciudad_id` integer
);

CREATE TABLE `Usuario` (
  `id` integer PRIMARY KEY,
  `email` varchar(255),
  `password` varchar(255),
  `compania_id` integer
); 

CREATE TABLE `Compania` (
  `id` integer PRIMARY KEY,
  `nombre_compania` varchar(255),
  `ciudad_id` integer
);

CREATE TABLE `Bombero` (
  `id` integer PRIMARY KEY,
  `rut` varchar(255),
  `nombres` varchar(255),
  `apellidos` varchar(255),
  `edad` integer,
  `usuario_id` integer UNIQUE,
  `cargo_id` integer
);

CREATE TABLE `Cargo` (
  `id` integer PRIMARY KEY,
  `nombre_cargo` varchar(255)
);

CREATE TABLE `TipoSiniestro` (
  `id` integer PRIMARY KEY,
  `nombre_tipo_siniestro` varchar(255)
);

CREATE TABLE `Siniestro` (
  `id` integer PRIMARY KEY,
  `clave_referencia` text,
  `fecha` date,
  `hora` time,
  `perdidas_materiales` varchar(255),
  `afectados` varchar(255),
  `implementos_utilizados` varchar(255),
  `descripcion` text COMMENT 'Descripción del siniestro',
  `tipo_siniestro_id` integer,
  `comuna_id` integer,
  `bombero_id` integer,
  `usuario_id` integer,
  `created_at` timestamp
);

ALTER TABLE `Region` ADD FOREIGN KEY (`pais_id`) REFERENCES `Pais` (`id`);

ALTER TABLE `Ciudad` ADD FOREIGN KEY (`region_id`) REFERENCES `Region` (`id`);

ALTER TABLE `Comuna` ADD FOREIGN KEY (`ciudad_id`) REFERENCES `Ciudad` (`id`);

ALTER TABLE `Usuario` ADD FOREIGN KEY (`compania_id`) REFERENCES `Compania` (`id`);

ALTER TABLE `Compania` ADD FOREIGN KEY (`ciudad_id`) REFERENCES `Ciudad` (`id`);

ALTER TABLE `Bombero` ADD FOREIGN KEY (`usuario_id`) REFERENCES `Usuario` (`id`) ON DELETE CASCADE;

ALTER TABLE `Bombero` ADD FOREIGN KEY (`cargo_id`) REFERENCES `Cargo` (`id`);

ALTER TABLE `Siniestro` ADD FOREIGN KEY (`tipo_siniestro_id`) REFERENCES `TipoSiniestro` (`id`);

ALTER TABLE `Siniestro` ADD FOREIGN KEY (`comuna_id`) REFERENCES `Comuna` (`id`);

ALTER TABLE `Siniestro` ADD FOREIGN KEY (`bombero_id`) REFERENCES `Bombero` (`id`);

ALTER TABLE `Siniestro` ADD FOREIGN KEY (`usuario_id`) REFERENCES `Usuario` (`id`);
