const { ethers } = hre;
const assert = require('assert');

describe('Proxy', () => {
  let Proxy;

  let user;

  let ImplementationV1, ImplementationV2;

  before('identify signers', async () => {
    [user] = await ethers.getSigners();
  });

  describe('when the contract is deployed', () => {
    before('deploy the contract', async () => {
      const factory = await ethers.getContractFactory('ProxyMock');
      Proxy = await factory.deploy();
    });

    it('shows that the implementation is zero', async () => {
      assert.equal(await Proxy.getImplementation(), '0x0000000000000000000000000000000000000000');
    });

    describe('when attempting to upgrade to an implementation with the zero address', () => {
      it('reverts', async () => {
        await assertRevert(
          Proxy.upgradeTo('0x0000000000000000000000000000000000000000'),
          'Implementation is zero address'
        );
      });
    });

    describe('when attempting to upgrade to an implementation that is not a contract', () => {
      it('reverts', async () => {
        await assertRevert(Proxy.upgradeTo(user.address), 'Implementation not a contract');
      });
    });

    describe('when upgrading the implementation', () => {
      before('deploy the first implementation', async () => {
        const factory = await ethers.getContractFactory('ImplementationMockV1');
        ImplementationV1 = await factory.deploy();
      });

      before('upgrade', async () => {
        await (await Proxy.upgradeTo(ImplementationV1.address)).wait();
      });

      it('shows that the implementation is set', async () => {
        assert.equal(await Proxy.getImplementation(), ImplementationV1.address);
      });

      describe('when interacting with the first implementation', () => {
        before('cast to the first implementation', async () => {
          ImplementationV1 = await ethers.getContractAt('ImplementationMockV1', Proxy.address);
        });

        it('shows the initial value of a', async () => {
          assert.equal(await ImplementationV1.getA(), 0);
        });

        describe('when setting value a', () => {
          before('set a', async () => {
            await (await ImplementationV1.setA(42)).wait();
          });

          it('shows the new value of a', async () => {
            assert.equal(await ImplementationV1.getA(), 42);
          });
        });

        describe('when upgrading to a new implementation', () => {
          before('deploy the second implementation', async () => {
            const factory = await ethers.getContractFactory('ImplementationMockV2');
            ImplementationV2 = await factory.deploy();
          });

          before('upgrade', async () => {
            await (await Proxy.upgradeTo(ImplementationV2.address)).wait();
          });

          it('shows that the implementation is set', async () => {
            assert.equal(await Proxy.getImplementation(), ImplementationV2.address);
          });

          describe('when interacting with the second implementation', () => {
            before('cast to the second implementation', async () => {
              ImplementationV2 = await ethers.getContractAt('ImplementationMockV2', Proxy.address);
            });

            it('shows the current value of a', async () => {
              assert.equal(await ImplementationV2.getA(), 42);
            });

            it('shows the initial value of b', async () => {
              assert.equal(await ImplementationV2.getB(), '');
            });

            describe('when setting value b', () => {
              before('set b', async () => {
                await (await ImplementationV2.setB('hello')).wait();
              });

              it('shows the new value of b', async () => {
                assert.equal(await ImplementationV1.getB(), 'hello');
              });
            });
          });
        });
      });
    });
  });
});
