

// request random will identifier to create a uniquw will
export async function request_random_will_identifier(): Promise<string> {
    const MULTIPLY_BY_10s = 10 ** 16;
    //   const randomnessResult = await managementCanister.raw_rand().call();
    return String(
      parseInt(
        String(Math.random() * MULTIPLY_BY_10s + Math.random() * MULTIPLY_BY_10s)
      )
    );
  }