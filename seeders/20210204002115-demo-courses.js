
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('courses', [{
      name: 'JavaScript do zero!',
      description: 'Aprenda JavaScript do zero ao avançado, com muita prática!',
      image: 'https://static.imasters.com.br/wp-content/uploads/2018/12/10164438/javascript.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      name: 'Python do zero!',
      description: 'Aprenda Python do zero ao avançado, com muita prática!',
      image: 'https://sujeitoprogramador.com/wp-content/uploads/2019/11/pythondozero.png',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      name: 'Java do zero!',
      description: 'Aprenda Java do zero ao avançado, com muita prática!',
      image: 'https://miro.medium.com/max/1200/1*ADqbtRNCtoGE-1bvvoSQdg.jpeg',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      name: 'C# do zero!',
      description: 'Aprenda C# do zero ao avançado, com muita prática!',
      image: 'https://addcode.io/wp-content/uploads/2020/02/csharp.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
    const courseChapters = [
      [
        {
          name: 'Apresentação',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Preparando o ambiente',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Introdução à linguagem JS',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Variáveis e Tipos de Dados',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Estruturas lógicas e condicionais',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      [
        {
          name: 'Apresentação',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Preparando o ambiente',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Introdução à linguagem Python',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Variáveis e Tipos de Dados',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Estruturas lógicas e condicionais',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      [
        {
          name: 'Apresentação',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Preparando o ambiente',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Introdução à linguagem Java',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Variáveis e Tipos de Dados',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Estruturas lógicas e condicionais',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      [
        {
          name: 'Apresentação',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Preparando o ambiente',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Introdução à linguagem C#',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Variáveis e Tipos de Dados',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Estruturas lógicas e condicionais',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    ];

    const coursesIds = await queryInterface.sequelize.query(
      'SELECT id from courses;',
    );

    const ids = coursesIds[0];

    queryInterface.bulkInsert('chapters',
      [
        {
          ...courseChapters[0][0],
          courseId: ids[0].id,
        },
        {
          ...courseChapters[0][1],
          courseId: ids[0].id,
        },
        {
          ...courseChapters[0][2],
          courseId: ids[0].id,
        },
        {
          ...courseChapters[0][3],
          courseId: ids[0].id,
        },
        {
          ...courseChapters[1][0],
          courseId: ids[1].id,
        },
        {
          ...courseChapters[1][1],
          courseId: ids[1].id,
        },
        {
          ...courseChapters[1][2],
          courseId: ids[1].id,
        },
        {
          ...courseChapters[1][3],
          courseId: ids[1].id,
        },
        {
          ...courseChapters[2][0],
          courseId: ids[2].id,
        },
        {
          ...courseChapters[2][1],
          courseId: ids[2].id,
        },
        {
          ...courseChapters[2][2],
          courseId: ids[2].id,
        },
        {
          ...courseChapters[2][3],
          courseId: ids[2].id,
        },
        {
          ...courseChapters[3][0],
          courseId: ids[3].id,
        },
        {
          ...courseChapters[3][1],
          courseId: ids[3].id,
        },
        {
          ...courseChapters[3][2],
          courseId: ids[3].id,
        },
        {
          ...courseChapters[3][3],
          courseId: ids[3].id,
        },
      ], {});

      const topics = [
        {
          name: 'Como usar',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Entrando na plataforma',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Fazendo teorias',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Fazendo exercícios',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      const chaptersIds = await queryInterface.sequelize.query(
        'SELECT id from chapters;',
      );

      queryInterface.bulkInsert('topics',
      [
        {
          ...topics[0],
          chapterId: chaptersIds[0][0].id,
        },
        {
          ...topics[1],
          chapterId: chaptersIds[0][0].id,
        },
        {
          ...topics[2],
          chapterId: chaptersIds[0][0].id,
        },
        {
          ...topics[3],
          chapterId: chaptersIds[0][0].id,
        },
        {
          ...topics[0],
          chapterId: chaptersIds[0][1].id,
        },
        {
          ...topics[1],
          chapterId: chaptersIds[0][1].id,
        },
        {
          ...topics[2],
          chapterId: chaptersIds[0][1].id,
        },
        {
          ...topics[3],
          chapterId: chaptersIds[0][1].id,
        },
        {
          ...topics[0],
          chapterId: chaptersIds[0][2].id,
        },
        {
          ...topics[1],
          chapterId: chaptersIds[0][2].id,
        },
        {
          ...topics[2],
          chapterId: chaptersIds[0][2].id,
        },
        {
          ...topics[3],
          chapterId: chaptersIds[0][2].id,
        },
        {
          ...topics[0],
          chapterId: chaptersIds[0][3].id,
        },
        {
          ...topics[1],
          chapterId: chaptersIds[0][3].id,
        },
        {
          ...topics[2],
          chapterId: chaptersIds[0][3].id,
        },
        {
          ...topics[3],
          chapterId: chaptersIds[0][3].id,
        },
        {
          ...topics[0],
          chapterId: chaptersIds[0][4].id,
        },
        {
          ...topics[1],
          chapterId: chaptersIds[0][4].id,
        },
        {
          ...topics[2],
          chapterId: chaptersIds[0][4].id,
        },
        {
          ...topics[3],
          chapterId: chaptersIds[0][4].id,
        },
        {
          ...topics[0],
          chapterId: chaptersIds[0][5].id,
        },
        {
          ...topics[1],
          chapterId: chaptersIds[0][5].id,
        },
        {
          ...topics[2],
          chapterId: chaptersIds[0][5].id,
        },
        {
          ...topics[3],
          chapterId: chaptersIds[0][5].id,
        },
      ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('topics', null, {});
    await queryInterface.bulkDelete('chapters', null, {});
    await queryInterface.bulkDelete('courses', null, {});
  },
};
