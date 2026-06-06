import { Prisma } from '@prisma/client';

export const softDeleteExtension = Prisma.defineExtension({
  name: 'softDelete',
  model: {
    user: {
      async delete<M extends { where: Prisma.UserWhereUniqueInput }>(
        this: M,
        where: M['where'],
      ): Promise<Prisma.UserGetPayload<{}>> {
        const context = Prisma.getExtensionContext(this);
        return (context as any).update({
          where,
          data: { isActive: false },
        });
      },
    },
  },
});

export const paginationExtension = Prisma.defineExtension({
  name: 'pagination',
  model: {
    $allModels: {
      async paginate<T, A>(
        this: T,
        args: A & { page?: number; limit?: number },
      ) {
        const { page = 1, limit = 10, ...rest } = args as any;
        const skip = (page - 1) * limit;

        const context = Prisma.getExtensionContext(this) as any;
        const [data, total] = await Promise.all([
          context.findMany({ ...rest, skip, take: limit }),
          context.count({ where: (rest as any).where }),
        ]);

        return {
          data,
          meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        };
      },
    },
  },
});

export { Prisma };
