Use master;
GO

IF EXISTS (SELECT 1 FROM sys.databases WHERE [name] = 'JuegoCrackTheCode')
BEGIN
	ALTER DATABASE JuegoCrackTheCode SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
	DROP DATABASE JuegoCrackTheCode;
END;

CREATE DATABASE JuegoCrackTheCode;
GO

USE JuegoCrackTheCode;
GO
DROP TABLE IF EXISTS Pais;
CREATE TABLE Pais(
    CodTel VARCHAR(4) PRIMARY KEY NOT NULL,
    NombrePais VARCHAR(50) NOT NULL
);
GO

DROP TABLE IF EXISTS Tutor;
CREATE TABLE Tutor(
    IDTutor INT PRIMARY KEY IDENTITY(1,1),
    NombreTutor VARCHAR(50) NOT NULL,
	PrimerApellido VARCHAR(50) NOT NULL, 
	SegundoApellido VARCHAR(50) NOT NULL,
	Email VARCHAR(50) NOT NULL UNIQUE,
	[Password] VARCHAR(80) NOT NULL,
	Telefono VARCHAR(50) NOT NULL,
	CodTel VARCHAR(4), 
	CONSTRAINT FK_Tutor_PAIS FOREIGN KEY (CodTel)
    REFERENCES Pais(CodTel)
	ON UPDATE NO ACTION
    ON DELETE NO ACTION
);
GO

DROP TABLE IF EXISTS Usuario;
CREATE TABLE Usuario(
    IDUsuario int PRIMARY KEY IDENTITY(1,1),
    NombreUsuario VARCHAR(50) NOT NULL,
    PrimerApellido VARCHAR(50) NOT NULL,
	SegundoApellido VARCHAR(50) NOT NULL,
	Progreso INT NOT NULL DEFAULT 0,
	GamerTag VARCHAR(50) NOT NULL UNIQUE,
	[Password] VARCHAR(80) NOT NULL,
	Calificacion INT,
	Fecha DATE NOT NULL,
    IDTutor INT, CONSTRAINT FK_Usuario_Tutor FOREIGN KEY (IDTutor)
    REFERENCES Tutor(IDTutor)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
);

--Multiples partidas 
DROP TABLE IF EXISTS Partida;
CREATE TABLE Partida(
    IDPartida INT PRIMARY KEY IDENTITY(1,1),
    Fecha DATE NOT NULL,
	IDUsuario INT NOT NULL,
    CONSTRAINT FK_USUARIO_PARTIDA FOREIGN KEY (IDUsuario)
    REFERENCES Usuario(IDUsuario)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION,
	Puntaje INT, 
);
GO

DROP TABLE IF EXISTS Comentarios;
CREATE TABLE Comentarios(
    IDComentario INT PRIMARY KEY IDENTITY(1,1),
	Comentario VARCHAR(100),
    IDUsuario INT,
    CONSTRAINT FK_COMENTARIO_USUARIO FOREIGN KEY (IDUsuario)
    REFERENCES Usuario(IDUsuario)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
);
GO


CREATE OR ALTER TRIGGER TRG_Usuario_INSERT
ON Usuario
INSTEAD OF INSERT
AS
BEGIN 
	DECLARE @NombreUsuario AS VARCHAR (50);
	DECLARE @PrimerApellido AS VARCHAR (50);
	DECLARE @SegundoApellido AS VARCHAR (50);
	DECLARE @GamerTag AS VARCHAR(50);
    DECLARE @Password AS VARCHAR(64);
    DECLARE @Calificacion AS INT;
    DECLARE @Fecha AS DATE;
    DECLARE @EmailTutor AS VARCHAR(50);
    DECLARE @IDTutor INT;

	SELECT @NombreUsuario = (SELECT NombreUsuario from inserted);
    SELECT @PrimerApellido = (SELECT PrimerApellido from inserted);
	SELECT @SegundoApellido = (SELECT SegundoApellido from inserted);
	SELECT @GamerTag = (SELECT GamerTag from inserted);
	SELECT @Password = (SELECT [Password] from inserted);
	SELECT @Calificacion = 0; --ALTERAR EN VIDEOJUEGO
	SELECT @Fecha= (SELECT Fecha from inserted);
    SELECT @IDTutor = (SELECT IDTutor from inserted);
	--SELECT @IDTutor = (Select IDTutor from Tutor where email = @EmailTutor)

	DECLARE @Salt AS VARCHAR (16);
	SELECT @Salt = CONVERT (VARCHAR(16),CRYPT_GEN_RANDOM(8),2);
	
	DECLARE @HashedPasword AS VARCHAR (80);
	SELECT @HashedPasword = @Salt + CONVERT(VARCHAR(64), HASHBYTES('SHA2_256', @Salt + @Password), 2);

	INSERT INTO Usuario (NombreUsuario, PrimerApellido, SegundoApellido, GamerTag, [Password], Calificacion, Fecha, idTutor) VALUES
	(@NombreUsuario, @PrimerApellido, @SegundoApellido, @GamerTag, @HashedPasword, @Calificacion, @Fecha, @IDTutor);
END;
GO

CREATE OR ALTER TRIGGER TRG_Tutor_INSERT
ON Tutor
INSTEAD OF INSERT
AS
BEGIN 
	DECLARE @NombreTutor AS VARCHAR (50);
	DECLARE @PrimerApellido AS VARCHAR (50);
	DECLARE @SegundoApellido AS VARCHAR (50);
	DECLARE @Email AS VARCHAR(50);
    DECLARE @Password AS VARCHAR(64);
    DECLARE @Telefono AS VARCHAR(10);
    DECLARE @CodTel AS VARCHAR(4);

	SELECT @NombreTutor = (SELECT NombreTutor from inserted);
    SELECT @PrimerApellido = (SELECT PrimerApellido from inserted);
	SELECT @SegundoApellido = (SELECT SegundoApellido from inserted);
	SELECT @Email = (SELECT Email from inserted);
	SELECT @Password = (SELECT [Password] from inserted);
	SELECT @Telefono= (SELECT Telefono from inserted);
    SELECT @CodTel = (SELECT CodTel from inserted);
	 
	DECLARE @Salt AS VARCHAR (16);
	SELECT @Salt = CONVERT (VARCHAR(16),CRYPT_GEN_RANDOM(8),2);
	
	DECLARE @HashedPasword AS VARCHAR (80);
	SELECT @HashedPasword = @Salt + CONVERT(VARCHAR(64), HASHBYTES('SHA2_256', @Salt + @Password), 2);

	INSERT INTO Tutor (NombreTutor, PrimerApellido, SegundoApellido, Email, [Password], Telefono, CodTel) VALUES
	(@NombreTutor, @PrimerApellido, @SegundoApellido, @Email, @HashedPasword, @Telefono, @CodTel);
END;
GO

CREATE OR ALTER TRIGGER TRG_Usuario_DELETE
ON Usuario
INSTEAD OF DELETE 
AS 
BEGIN 
    DECLARE @variable AS VARCHAR(50);
	DECLARE @num AS INT;
    SELECT @variable = (SELECT GamerTag FROM deleted);
	SELECT @num = (SELECT IDUsuario FROM Usuario WHERE @variable=GamerTag);

	BEGIN TRANSACTION;
	DELETE FROM Partida WHERE IDUsuario = @num;
	DELETE FROM Comentarios WHERE IDUsuario = @num;
	COMMIT;
END;
GO

CREATE OR ALTER TRIGGER TRG_Tutor_DELETE
ON Tutor
INSTEAD OF DELETE 
AS 
BEGIN 
    DECLARE @IDTutor AS int;

    SELECT @IDTutor = (SELECT IDTutor FROM deleted);
	BEGIN TRANSACTION;
	DELETE FROM Usuario WHERE IDTutor = @IDTutor;
	DELETE FROM Tutor WHERE IDTutor = @IDTutor;
	COMMIT;
END;
GO

--CREATE OR ALTER TRIGGER TRG_Update_User_Password
--ON Usuario
--INSTEAD OF UPDATE
--AS
--BEGIN
--	DECLARE @Password as VARCHAR(64);
--	DECLARE @Gamertag as VARCHAR(50);
--	DECLARE @Salt AS VARCHAR (16);
--	SELECT @Password = (SELECT [Password] FROM inserted );
--	SELECT @Gamertag = (
--	SELECT @Salt = CONVERT (VARCHAR(16),CRYPT_GEN_RANDOM(8),2);
	
--	DECLARE @HashedPasword AS VARCHAR (80);
--	SELECT @HashedPasword = @Salt + CONVERT(VARCHAR(64), HASHBYTES('SHA2_256', @Salt + @Password), 2);
--	UPDATE [Usuario] SET [Password] = @HashedPasword;
--END
--GO

--CREATE OR ALTER TRIGGER TRG_Update_Tutor_Password
--ON Tutor
--INSTEAD OF UPDATE
--AS
--BEGIN
--	DECLARE @Password as VARCHAR(64);
--	DECLARE @Salt AS VARCHAR (16);
--	SELECT @Password = (SELECT [Password] FROM inserted );
--	SELECT @Salt = CONVERT (VARCHAR(16),CRYPT_GEN_RANDOM(8),2);
	
--	DECLARE @HashedPasword AS VARCHAR (80);
--	SELECT @HashedPasword = @Salt + CONVERT(VARCHAR(64), HASHBYTES('SHA2_256', @Salt + @Password), 2);
--	UPDATE Tutor SET [Password] = @HashedPasword;
--END
--GO

--DATOS
INSERT INTO Pais (CodTel,NombrePais) VALUES ('1','Peru');
INSERT INTO Pais (CodTel,NombrePais) VALUES ('2','México');
INSERT INTO Pais (CodTel,NombrePais) VALUES ('3','Cuba');
INSERT INTO Pais (CodTel,NombrePais) VALUES ('4','Argentina');
INSERT INTO Pais (CodTel,NombrePais) VALUES ('5','Colombia');
GO

INSERT INTO Tutor (NombreTutor, PrimerApellido,SegundoApellido, Email, [Password], Telefono, CodTel) VALUES ('John', 'Smith', 'Smith', 'johnsmith@gmail.com', '123456', '5520816862', '1');
INSERT INTO Tutor (NombreTutor, PrimerApellido,SegundoApellido, Email, [Password], Telefono, CodTel) VALUES ('Maria', 'Garcia','Garcia', 'mariagarcia@gmail.com', '654321', '0987654321', '2');
INSERT INTO Tutor (NombreTutor, PrimerApellido,SegundoApellido, Email, [Password], Telefono, CodTel) VALUES ('Pedro', 'Perez', 'Perez','pedroperez@gmail.com', 'abc123', '1112223333', '3');
INSERT INTO Tutor (NombreTutor, PrimerApellido,SegundoApellido, Email, [Password], Telefono, CodTel) VALUES ('Juan', 'Garcia', 'Martinez','juangarcia@gmail.com', 'def456', '4445556666', '1');
INSERT INTO Tutor (NombreTutor, PrimerApellido,SegundoApellido, Email, [Password], Telefono, CodTel) VALUES ('Maria', 'Lopez', 'Santos','marialopez@gmail.com', 'ghi789', '7778889999', '4');
INSERT INTO Tutor (NombreTutor, PrimerApellido,SegundoApellido, Email, [Password], Telefono, CodTel) VALUES ('Luis', 'Gonzalez', 'Gutierrez','luisgonzalez@gmail.com', 'jkl012', '1011121314', '2');
INSERT INTO Tutor (NombreTutor, PrimerApellido,SegundoApellido, Email, [Password], Telefono, CodTel) VALUES ('Ana', 'Martinez', 'Rodriguez','anamartinez@gmail.com', 'mno345', '1213141516', '5');
INSERT INTO Tutor (NombreTutor, PrimerApellido,SegundoApellido, Email, [Password], Telefono, CodTel) VALUES ('Jorge', 'Perez', 'Gonzalez','jorgeperez@gmail.com', 'pqr678', '1617181920', '3');
INSERT INTO Tutor (NombreTutor, PrimerApellido,SegundoApellido, Email, [Password], Telefono, CodTel) VALUES ('Silvia', 'Sanchez', 'Garcia','silviasanchez@gmail.com', 'stu901', '2122232425', '2');
INSERT INTO Tutor (NombreTutor, PrimerApellido,SegundoApellido, Email, [Password], Telefono, CodTel) VALUES ('Miguel', 'Ramirez', 'Fernandez','miguelramirez@gmail.com', 'vwx234', '2627282930', '4');
INSERT INTO Tutor (NombreTutor, PrimerApellido,SegundoApellido, Email, [Password], Telefono, CodTel) VALUES ('Patricia', 'Castro', 'Lopez','patriciacastro@gmail.com', 'yz0123', '3132333435', '5');
INSERT INTO Tutor (NombreTutor, PrimerApellido,SegundoApellido, Email, [Password], Telefono, CodTel) VALUES ('Carlos', 'Hernandez', 'Ruiz','carloshernandez@gmail.com', '456abc', '3637383940', '1');
INSERT INTO Tutor (NombreTutor, PrimerApellido,SegundoApellido, Email, [Password], Telefono, CodTel) VALUES ('Laura', 'Gutierrez', 'Perez','lauragutierrez@gmail.com', '789def', '4142434445', '3');
GO

INSERT INTO Usuario (NombreUsuario, PrimerApellido, SegundoApellido, GamerTag, [Password], Fecha, IDTutor, Progreso) VALUES ('Juan', 'Rodriguez','Perez', 'juanro', '[Password]', '2022-01-01', 1, 4);
INSERT INTO Usuario (NombreUsuario, PrimerApellido, SegundoApellido,GamerTag, [Password], Fecha, IDTutor, Progreso) VALUES ('Ana', 'Gonzalez','Perez', 'ana', 'qwerty', '2022-02-01', 1, 3);
INSERT INTO Usuario (NombreUsuario, PrimerApellido, SegundoApellido,GamerTag, [Password], Fecha, IDTutor, Progreso) VALUES ('Carlos', 'Lopez', 'Perez','charlie', 'asdfgh',  '2022-01-01', 1, 2);
INSERT INTO Usuario (NombreUsuario, PrimerApellido, SegundoApellido,GamerTag, [Password], Fecha, IDTutor, Progreso) VALUES ('Juan', 'Hernandez','Perez', 'juancho', 'asdfgh',  '2022-01-01', 2, 2);
INSERT INTO Usuario (NombreUsuario, PrimerApellido, SegundoApellido,GamerTag, [Password], Fecha, IDTutor, Progreso) VALUES ('Ares', 'Ortiz', 'Perez','aressss', 'hola',  '2022-01-01', 2, 2);
INSERT INTO Usuario (NombreUsuario, PrimerApellido, SegundoApellido,GamerTag, [Password], Fecha, IDTutor, Progreso) VALUES ('Rosa', 'Figueroa', 'Perez','roseee411', 'asdfgh', '2022-01-01', 3, 2);

INSERT INTO Usuario (NombreUsuario, PrimerApellido, SegundoApellido, GamerTag, [Password], Fecha, IDTutor, Progreso) VALUES ('Pedro', 'Gonzalez', 'Lopez', 'pedrogz', 'abc123', '2022-02-02', 3, 2);
INSERT INTO Usuario (NombreUsuario, PrimerApellido, SegundoApellido, GamerTag, [Password], Fecha, IDTutor, Progreso) VALUES ('Maria', 'Lopez', 'Gutierrez', 'marialo', 'def456', '2022-03-03', 5, 3);
INSERT INTO Usuario (NombreUsuario, PrimerApellido, SegundoApellido, GamerTag, [Password], Fecha, IDTutor, Progreso) VALUES ('Luisa', 'Hernandez', 'Ruiz', 'luisahz', 'ghi789', '2022-04-04', 8, 1);
INSERT INTO Usuario (NombreUsuario, PrimerApellido, SegundoApellido, GamerTag, [Password], Fecha, IDTutor, Progreso) VALUES ('Carlos', 'Garcia', 'Santos', 'carlosg', 'jkl012', '2022-05-05', 2, 4);
INSERT INTO Usuario (NombreUsuario, PrimerApellido, SegundoApellido, GamerTag, [Password], Fecha, IDTutor, Progreso) VALUES ('Laura', 'Fernandez', 'Gonzalez', 'laurafg', 'mno345', '2022-06-06', 10, 2);
INSERT INTO Usuario (NombreUsuario, PrimerApellido, SegundoApellido, GamerTag, [Password], Fecha, IDTutor, Progreso) VALUES ('Ares', 'Ortiz', 'Botello', 'ares', 'pqr678', '2022-07-07', 6, 3);
INSERT INTO Usuario (NombreUsuario, PrimerApellido, SegundoApellido, GamerTag, [Password], Fecha, IDTutor, Progreso) VALUES ('Ana', 'Gutierrez', 'Castro', 'anagc', 'stu901', '2022-08-08', 9, 5);
INSERT INTO Usuario (NombreUsuario, PrimerApellido, SegundoApellido, GamerTag, [Password], Fecha, IDTutor, Progreso) VALUES ('Jorge', 'Perez', 'Martinez', 'jorgepm', 'vwx234', '2022-09-09', 1, 1);
INSERT INTO Usuario (NombreUsuario, PrimerApellido, SegundoApellido, GamerTag, [Password], Fecha, IDTutor, Progreso) VALUES ('Silvia', 'Lopez', 'Sanchez', 'silvial', 'yz0123', '2022-10-10', 11, 4);
INSERT INTO Usuario (NombreUsuario, PrimerApellido, SegundoApellido, GamerTag, [Password], Fecha, IDTutor, Progreso) VALUES ('Miguel', 'Gonzalez', 'Fernandez', 'miguelgf', '456abc', '2022-11-11', 4, 5);
GO

INSERT INTO Partida (Fecha, IDUsuario, Puntaje) VALUES ('2022-01-01', 1, 100);
INSERT INTO Partida (Fecha, IDUsuario, Puntaje) VALUES ('2022-01-02', 2, 200);
INSERT INTO Partida (Fecha, IDUsuario, Puntaje) VALUES ('2022-01-03', 3, 300);
INSERT INTO Partida (Fecha, IDUsuario, Puntaje) VALUES ('2022-01-02', 2, 500);
INSERT INTO Partida (Fecha, IDUsuario, Puntaje) VALUES ('2022-01-03', 1, 600);
INSERT INTO Partida (Fecha, IDUsuario, Puntaje) VALUES ('2022-01-01', 3, 700);
INSERT INTO Partida (Fecha, IDUsuario, Puntaje) VALUES ('2022-01-02', 2, 800);
INSERT INTO Partida (Fecha, IDUsuario, Puntaje) VALUES ('2022-01-03', 1, 900);
INSERT INTO Partida (Fecha, IDUsuario, Puntaje) VALUES ('2022-01-03', 1, 1002);
INSERT INTO Partida (Fecha, IDUsuario, Puntaje) VALUES ('2022-01-03', 1, 700);
INSERT INTO Partida (Fecha, IDUsuario, Puntaje) VALUES ('2022-01-03', 1, 1202);
INSERT INTO Partida (Fecha, IDUsuario, Puntaje) VALUES ('2022-01-01', 5, 2300);
INSERT INTO Partida (Fecha, IDUsuario, Puntaje) VALUES ('2022-02-02', 9, 3100);
INSERT INTO Partida (Fecha, IDUsuario, Puntaje) VALUES ('2022-03-03', 13, 2900);
INSERT INTO Partida (Fecha, IDUsuario, Puntaje) VALUES ('2022-04-04', 2, 2600);
INSERT INTO Partida (Fecha, IDUsuario, Puntaje) VALUES ('2022-05-05', 6, 1500);
INSERT INTO Partida (Fecha, IDUsuario, Puntaje) VALUES ('2022-06-06', 10, 3200);
INSERT INTO Partida (Fecha, IDUsuario, Puntaje) VALUES ('2022-07-07', 14, 1800);
INSERT INTO Partida (Fecha, IDUsuario, Puntaje) VALUES ('2022-08-08', 3, 3000);
INSERT INTO Partida (Fecha, IDUsuario, Puntaje) VALUES ('2022-09-09', 7, 3400);
INSERT INTO Partida (Fecha, IDUsuario, Puntaje) VALUES ('2022-10-10', 11, 2900);
INSERT INTO Partida (Fecha, IDUsuario, Puntaje) VALUES ('2022-11-11', 15, 3200);
INSERT INTO Partida (Fecha, IDUsuario, Puntaje) VALUES ('2022-12-12', 1, 2200);
INSERT INTO Partida (Fecha, IDUsuario, Puntaje) VALUES ('2023-01-01', 4, 1900);
INSERT INTO Partida (Fecha, IDUsuario, Puntaje) VALUES ('2023-02-02', 8, 2600);
INSERT INTO Partida (Fecha, IDUsuario, Puntaje) VALUES ('2023-01-03', 12, 350); --aaaa
INSERT INTO Partida (Fecha, IDUsuario, Puntaje) VALUES ('2023-01-04', 12, 100); --aaaa
INSERT INTO Partida (Fecha, IDUsuario, Puntaje) VALUES ('2023-01-04', 12, 200); --aaaa
INSERT INTO Partida (Fecha, IDUsuario, Puntaje) VALUES ('2023-01-05', 12, 500); --aaaa
INSERT INTO Partida (Fecha, IDUsuario, Puntaje) VALUES ('2023-01-10', 12, 500); --aaaa
INSERT INTO Partida (Fecha, IDUsuario, Puntaje) VALUES ('2023-01-20', 12, 1500); --aaaa
INSERT INTO Partida (Fecha, IDUsuario, Puntaje) VALUES ('2023-01-25', 12, 4000); --aaaa
INSERT INTO Partida (Fecha, IDUsuario, Puntaje) VALUES ('2023-01-28', 12, 1450); --aaaa
INSERT INTO Partida (Fecha, IDUsuario, Puntaje) VALUES ('2023-01-29', 12, 1560); --aaaa
INSERT INTO Partida (Fecha, IDUsuario, Puntaje) VALUES ('2023-01-30', 12, 2400); --aaaa
INSERT INTO Partida (Fecha, IDUsuario, Puntaje) VALUES ('2023-04-04', 2, 2300);
INSERT INTO Partida (Fecha, IDUsuario, Puntaje) VALUES ('2023-05-05', 6, 3200);
INSERT INTO Partida (Fecha, IDUsuario, Puntaje) VALUES ('2023-06-06', 10, 2800);
INSERT INTO Partida (Fecha, IDUsuario, Puntaje) VALUES ('2023-07-07', 14, 2400);
INSERT INTO Partida (Fecha, IDUsuario, Puntaje) VALUES ('2023-08-08', 3, 1700);
INSERT INTO Partida (Fecha, IDUsuario, Puntaje) VALUES ('2023-09-09', 7, 1900);
INSERT INTO Partida (Fecha, IDUsuario, Puntaje) VALUES ('2023-10-10', 11, 3200);
INSERT INTO Partida (Fecha, IDUsuario, Puntaje) VALUES ('2023-11-11', 15, 2800);
INSERT INTO Partida (Fecha, IDUsuario, Puntaje) VALUES ('2023-12-12', 1, 2100);
GO

INSERT INTO Comentarios (Comentario, IDUsuario) VALUES ('Me encanto el juego! Lo recomendaría', 1);
INSERT INTO Comentarios (Comentario, IDUsuario) VALUES ('Excelente aplicación! El Minijuego de encriptación es muy bueno', 2);
INSERT INTO Comentarios (Comentario, IDUsuario) VALUES ('Muy entretenido! Amo a los perritos', 3);
GO


UPDATE Usuario SET Progreso = 3 WHERE GamerTag = 'juanro';
UPDATE Usuario SET Progreso = 2 WHERE GamerTag = 'charlie';
UPDATE Usuario SET Progreso = 4 WHERE GamerTag = 'ana';
UPDATE Usuario SET Progreso = 4 WHERE GamerTag = 'aressss';
UPDATE Usuario SET Progreso = 3 WHERE GamerTag = 'roseee411';



UPDATE Usuario SET Progreso = 3 WHERE GamerTag = 'pedrogz';
UPDATE Usuario SET Progreso = 2 WHERE GamerTag = 'marialo';
UPDATE Usuario SET Progreso = 4 WHERE GamerTag = 'luisahz';
UPDATE Usuario SET Progreso = 4 WHERE GamerTag = 'carlosg';
UPDATE Usuario SET Progreso = 1 WHERE GamerTag = 'laurafg';
UPDATE Usuario SET Progreso = 2 WHERE GamerTag = 'robertrz';
UPDATE Usuario SET Progreso = 4 WHERE GamerTag = 'anagc';
UPDATE Usuario SET Progreso = 4 WHERE GamerTag = 'jorgepm';
UPDATE Usuario SET Progreso = 1 WHERE GamerTag = 'silvial';
UPDATE Usuario SET Progreso = 3 WHERE GamerTag = 'miguelgf';



----Consulta para obtener cuantos usuarios hay por pa�s:
--SELECT Pais.NombrePais, COUNT(*) AS Numero_Usuarios FROM Usuario
--	JOIN Pais ON Pais.CodTel = Usuario.CodTel
--GROUP BY Pais.NombrePais
--ORDER BY Numero_Usuarios DESC;
--GO
----Consulta para obtener la calificaci�n promedio que cada usuario le pone al juego:
--SELECT AVG(Usuario.Calificacion) as CalificacionPromedio FROM Usuario;
--GO
----Consulta para obtener el porcentaje de progreso de cada usuario:
--SELECT Usuario.NombreUsuario, (Partida.Progreso * 20) as '% de progreso' FROM Usuario
--	JOIN Partida ON Partida.IDUsuario = Usuario.IDUsuario;
--GO
----Consulta para conocer la edad promedio de los usuarios que han accedido:
--SELECT AVG(Usuario.Edad) as EdadPromedio FROM Usuario;
--GO
----Consulta para obtener los puntajes m�s altos:
--SELECT Usuario.NombreUsuario, Partida.Puntaje FROM Partida
--      JOIN Usuario ON Usuario.IDUsuario = Partida.IDUsuario
--ORDER BY Partida.Puntaje DESC;
--GO
