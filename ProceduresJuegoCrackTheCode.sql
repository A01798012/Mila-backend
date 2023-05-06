USE JuegoCrackTheCode;
GO

CREATE OR ALTER PROCEDURE PROC_Actualizar_Telefono
@Telefono AS VARCHAR(50),
@TelefonoPrev AS VARCHAR(50)
AS
BEGIN
	UPDATE Tutor SET Telefono = @Telefono
	WHERE Telefono = @TelefonoPrev;
END;
GO

CREATE OR ALTER PROCEDURE PROC_Actualizar_Gametag
@Gametag AS VARCHAR(50),
@PrevGametag AS VARCHAR(50)
AS
BEGIN
    UPDATE Usuario SET GamerTag = @Gametag WHERE GamerTag = @PrevGametag;
END;
GO

CREATE OR ALTER PROCEDURE PROC_CambiarPass_Usuario
@GamerTag AS VARCHAR(50),
@Password AS VARCHAR(80),
@nuevaPassword AS VARCHAR(64)
AS 
BEGIN
    DECLARE @Succes AS BIT;
    DECLARE @StoredPassword AS VARCHAR (80);
    SELECT @StoredPassword = 
    (SELECT [Password] FROM Usuario WHERE GamerTag LIKE @GamerTag);

    DECLARE @Salt AS VARCHAR (16);
    SELECT @Salt = SUBSTRING(@StoredPassword,1,16);

    DECLARE @HashedPasword AS VARCHAR(80);
    SELECT @HashedPasword = @Salt + CONVERT(VARCHAR(64), HASHBYTES('SHA2_256', @Salt + @Password), 2);

    SELECT @Succes = (CASE WHEN @HashedPasword = @StoredPassword THEN 1 ELSE 0 END);
    
    IF (@Succes = 1)
    BEGIN
        SELECT @HashedPasword = @Salt + CONVERT(VARCHAR(64), HASHBYTES('SHA2_256', @Salt + @nuevaPassword), 2); 
        UPDATE Usuario
        SET [Password] = @HashedPasword
        WHERE GamerTag = @GamerTag;
    END;
    SELECT @Succes = (CASE WHEN @HashedPasword = @StoredPassword THEN 1 ELSE 0 END);
    IF @Succes = 1
        RETURN 1;
    ELSE 
        RETURN 0;

END;
GO

CREATE OR ALTER PROCEDURE PROC_CambiarPass_Tutor
@Email AS VARCHAR(50),
@Password AS VARCHAR(80),
@nuevaPassword AS VARCHAR(64)
AS 
BEGIN 
    DECLARE @Succes AS BIT;
    DECLARE @StoredPassword AS VARCHAR (80);
    SELECT @StoredPassword = 
    (SELECT [Password] FROM Tutor WHERE @Email = Email);

    DECLARE @Salt AS VARCHAR (16);
    SELECT @Salt = SUBSTRING(@StoredPassword,1,16);

    DECLARE @HashedPasword AS VARCHAR(80);
    SELECT @HashedPasword = @Salt + CONVERT(VARCHAR(64), HASHBYTES('SHA2_256', @Salt + @Password), 2);

    SELECT @Succes = (CASE WHEN @HashedPasword = @StoredPassword THEN 1 ELSE 0 END);
    
    IF (@Succes = 1)
    BEGIN
        SELECT @HashedPasword = @Salt + CONVERT(VARCHAR(64), HASHBYTES('SHA2_256', @Salt + @nuevaPassword), 2); 
        UPDATE Tutor
        SET [Password] = @HashedPasword
        WHERE @Email = Email;
    END;

    SELECT @Succes = (CASE WHEN @HashedPasword = @StoredPassword THEN 1 ELSE 0 END);
    IF @Succes = 1
        RETURN 1;
    ELSE 
        RETURN 0;

END;
GO


CREATE OR ALTER PROCEDURE PROC_Login_Usuario
@GamerTag AS VARCHAR(50),
@Password AS VARCHAR(80)
AS 
BEGIN
    DECLARE @Succes AS BIT;
    DECLARE @StoredPassword AS VARCHAR (80);
    SELECT @StoredPassword = 
    (SELECT [Password] FROM Usuario WHERE GamerTag LIKE @GamerTag);

    DECLARE @Salt AS VARCHAR (16);
    SELECT @Salt = SUBSTRING(@StoredPassword,1,16);

    DECLARE @HashedPasword AS VARCHAR(80);
    SELECT @HashedPasword = @Salt + CONVERT(VARCHAR(64), HASHBYTES('SHA2_256', @Salt + @Password), 2);

    SELECT @Succes = (CASE WHEN @HashedPasword = @StoredPassword THEN 1 ELSE 0 END);
    IF @Succes = 1
        RETURN 1;
    ELSE 
        RETURN 0;
END;
GO

CREATE OR ALTER PROCEDURE PROC_Login_Tutor
@Email AS VARCHAR(50),
@Password AS VARCHAR(64)
AS 
BEGIN 
    DECLARE @Succes AS BIT;
    DECLARE @StoredPassword AS VARCHAR (80);
    SELECT @StoredPassword =
    (SELECT [Password] FROM Tutor WHERE Email LIKE @Email);

    DECLARE @Salt AS VARCHAR (16);
    SELECT @Salt = SUBSTRING(@StoredPassword,1,16);

    DECLARE @HashedPasword AS VARCHAR(80);
    SELECT @HashedPasword = @Salt + CONVERT(VARCHAR(64), HASHBYTES('SHA2_256', @Salt + @Password), 2);

    SELECT @Succes = (CASE WHEN @HashedPasword = @StoredPassword THEN 1 ELSE 0 END);
    IF @Succes = 1
        RETURN 1;
    ELSE 
        RETURN 0;

END;
GO


CREATE OR ALTER PROCEDURE PROC_BorrarPartida
@IDUsuario AS INT
AS 
BEGIN
    DELETE FROM Partida
    WHERE IDUsuario = @IDUsuario
END;
GO

CREATE OR ALTER PROCEDURE PROC_BorrarComentario
@GamerTag AS VARCHAR(50)
AS 
BEGIN
    DECLARE @IDUsuario AS INT;
    SELECT @IDUsuario FROM Usuario WHERE @GamerTag = GamerTag;

    DELETE FROM Comentarios
    WHERE @IDUsuario = IDUsuario;
END;
GO


CREATE OR ALTER PROCEDURE PROC_Consultar_Progreso
@GamerTag AS VARCHAR(50)
AS
BEGIN
    SELECT GamerTag, (Progreso*100)/4 as '% De Progreso' FROM Usuario where GamerTag = @GamerTag;
END;
GO


 CREATE OR ALTER PROCEDURE PROC_Insertar_Usuario
	 @NombreUsuario VARCHAR(50),
	 @PrimerApellido VARCHAR (50),
	 @SegundoApellido VARCHAR(50),
	 @GamerTag VARCHAR(50), 
	 @Password VARCHAR(80), 
	 @Fecha DATE,
	 @EmailTutor VARCHAR(50)

AS BEGIN 
	SET NOCOUNT ON;
	DECLARE @IDTutor AS INT;
	SELECT @IDTutor = (SELECT IDTutor from Tutor where email = @EmailTutor)
	INSERT INTO Usuario
		(NombreUsuario, PrimerApellido, SegundoApellido, Gamertag, [Password], Fecha, idTutor)
	VALUES
		(@NombreUsuario, @PrimerApellido, @segundoApellido, @GamerTag, @Password, @Fecha, @IDTutor)
END;
GO

CREATE OR ALTER PROCEDURE PROC_Insertar_Tutor
	 @NombreTutor VARCHAR(50),
	 @PrimerApellido VARCHAR (50),
	 @SegundoApellido VARCHAR (50),
	 @Email VARCHAR(50),
	 @Password VARCHAR(80), 
	 @Telefono VARCHAR(10),
	 @CodTel VARCHAR(4)
AS BEGIN 
	SET NOCOUNT ON;

	INSERT INTO Tutor
		(NombreTutor, PrimerApellido, SegundoApellido, Email,[Password], Telefono, CodTel)
	VALUES
		(@NombreTutor, @PrimerApellido, @SegundoApellido, @Email, @Password, @Telefono, @CodTel)
END;
GO

CREATE OR ALTER PROCEDURE PROC_Insertar_Comentario
@GamerTag VARCHAR(50),
@Comentario VARCHAR(100)
AS BEGIN 
    DECLARE @IDUsuario AS INT;
    SELECT @IDUsuario = (SELECT IDUsuario FROM Usuario WHERE @GamerTag = GamerTag);
	INSERT INTO Comentarios (IDUsuario, Comentario) 
	VALUES (@IDUsuario, @Comentario);

END;
GO

CREATE OR ALTER PROCEDURE PROC_Insertar_Puntaje
@GamerTag VARCHAR(50),
@Puntaje INT
AS 
BEGIN 
    DECLARE @IDUsuario AS INT;
    SELECT @IDUsuario = (SELECT IDUsuario FROM Usuario WHERE @GamerTag = GamerTag);
    
	INSERT INTO Partida (IDUsuario, Puntaje, Fecha) 
	VALUES (@IDUsuario, @Puntaje, GETDATE());
    
END;
GO

CREATE OR ALTER PROCEDURE PROC_Actualizar_Calificacion
@GamerTag VARCHAR(50),
@Calificacion INT
AS 
BEGIN 
    UPDATE Usuario SET Calificacion = @Calificacion WHERE GamerTag = @GamerTag;
END;
GO

CREATE OR ALTER PROCEDURE PROC_Obtener_Scores_Usuario
@Gamertag VARCHAR(50)
AS
BEGIN
	DECLARE @IDUsuario AS INT;
	SELECT @IDUsuario = (SELECT IDUsuario FROM Usuario WHERE GamerTag = @Gamertag);
	SELECT TOP 100 Puntaje, Fecha FROM Partida WHERE @IDUsuario = IDUsuario
	ORDER BY FECHA;
END;
GO

CREATE OR ALTER PROCEDURE PROC_Obtener_Puntaje_Maximo
@Gamertag VARCHAR(50)
AS
BEGIN
	select USUARIO.gamertag, max(puntaje) as Puntaje from Partida
	JOIN Usuario ON Partida.IDUsuario = Usuario.IDUsuario where GamerTag = @Gamertag
	GROUP BY Usuario.GamerTag
	ORDER BY Puntaje DESC
END;
GO

CREATE OR ALTER PROCEDURE PROC_Leaderboard_pagina
@PageNumber as INT
AS
BEGIN
    SELECT  ROW_NUMBER() OVER (ORDER BY Puntaje DESC) AS Place,
		GamerTag,
		Puntaje,
		Progreso,
		MIN(Partida.Fecha) AS Fecha
		FROM Usuario
		JOIN Partida ON Usuario.IDUsuario = Partida.IDUsuario
		WHERE Puntaje = (SELECT MAX(Puntaje) FROM Partida WHERE IDUsuario = Usuario.IDUsuario)
	GROUP BY GamerTag, Puntaje, Progreso
	ORDER BY Puntaje DESC
	OFFSET (@PageNumber - 1) * 10 ROWS
	FETCH NEXT 10 ROWS ONLY;

END;
GO

CREATE OR ALTER PROCEDURE PROC_Partidas_Jugadas
@Gamertag AS VARCHAR(50)
AS
BEGIN
	select COUNT(*) as Cantidad from Usuario
	join Partida on partida.IDUsuario = Usuario.IDUsuario
	where GamerTag = @Gamertag
END;
GO

CREATE OR ALTER PROCEDURE PROC_Consultar_Progreso_Global
AS
BEGIN
	select progreso*100/4 AS '% de Progreso', count(*) as Cantidad FROM Usuario
	GROUP BY progreso*100/4;
END;
GO

CREATE OR ALTER PROCEDURE PROC_Consultar_Miembros_Pais
AS
BEGIN
	select Pais.NombrePais as Pais, count(*) as Cantidad FROM Usuario
	JOIN Tutor ON Usuario.IDTutor = Tutor.IDTutor
	JOIN Pais ON Tutor.CodTel = pais.codtel
	group by Pais.NombrePais
END;
GO

CREATE OR ALTER PROCEDURE PROC_Obtener_Comentario
AS
BEGIN
	select top(5) comentario from comentarios;
END;
GO

CREATE OR ALTER PROCEDURE PROC_Consultar_Progreso_Usuario
@Gamertag as VARCHAR(50)
AS
BEGIN
	select progreso*100/4 AS '% de Progreso' FROM Usuario WHERE Gamertag=@Gamertag;
END;
GO

CREATE OR ALTER PROCEDURE PROC_Udate_Progress
@Gamertag AS VARCHAR(50),
@Progreso as INT
AS
BEGIN
    UPDATE Usuario SET Progreso = @Progreso WHERE GamerTag = @Gamertag;
END;
GO

CREATE OR ALTER PROCEDURE PROC_Udate_Calificacion
@Gamertag AS VARCHAR(50),
@Calificacion as INT
AS
BEGIN
    UPDATE Usuario SET Calificacion = @Calificacion WHERE GamerTag = @Gamertag;
END;
GO
--YA
--actualizar telefono
--actualizar gamertag
--actualizar pass usuario 
--actualizar pass tutor
--login tutor
--login usuario
--borrar partida
--borrar comentario
--consultar progreso
--insertar usuario (PROC)
--insertar tutor (PROC)
--insertar comentario 
--actualizar puntaje 
--actualizar calificacion 

