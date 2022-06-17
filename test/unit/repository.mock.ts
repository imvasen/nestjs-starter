export const repoMockFactory = (entityClass, data = []) => {
  const mockRepo = jest.fn(() => ({
    find: jest.fn((entity) => entity).mockImplementation(async () => data),
    findOne: jest
      .fn(async (entity) => entity)
      .mockImplementation(() => {
        if (data.length) {
          return data[0];
        }

        return null;
      }),
    create: jest
      .fn((entity) => entity)
      .mockImplementation((v) => {
        let newUser = new entityClass();
        for (const key of Object.keys(v)) {
          newUser[key] = v[key];
        }

        return newUser;
      }),
    insert: jest
      .fn((entity) => entity)
      .mockImplementation(async (v) => data.push(v)),
  }));

  return mockRepo;
};
