const account = useActiveAccount();

const smartAccount = getContract({
    client: client,
    chain: sepolia,
    address: account?.address as string,
});

const contract = getContract({
    client: client,
    chain: sepolia,
    address: contractAddress,
    abi: contractABI,
});

const { data: count, isLoading: isCountLoading } = useReadContract({
    contract: contract,
    method: "getCount",
    params: [],
});

const { data: activeSigners, refetch: refetchActiveSigners } =
    useReadContract(getAllActiveSigners, {
        contract: smartAccount,
    });


const createSessionKey = async () => {
    if (!account) return;

    setIsLoading(true);
    try {
        const tx = addSessionKey({
            contract: smartAccount,
            account: account,
            sessionKeyAddress: "0x0B30B81531227161b9A09C1c2E01302a50942Cbd",
            permissions: {
                approvedTargets: "*",
                nativeTokenLimitPerTransaction: 0.1,
                permissionStartTimestamp: new Date(),
                permissionEndTimestamp: new Date(
                    Date.now() + 1000 * 60 * 60 * 24 * 30,
                ),
            },
        });

        await sendAndConfirmTransaction({
            account: account,
            transaction: tx,
        });
    } catch (error) {
        console.error(error);
    } finally {
        setIsLoading(false);
        refetchActiveSigners();
    }
};

const deleteSessionKey = async (signer: string) => {
    if (!account) return;

    setIsLoading(true);
    try {
        const tx = removeSessionKey({
            contract: smartAccount,
            account: account,
            sessionKeyAddress: signer,
        });

        await sendAndConfirmTransaction({
            account: account,
            transaction: tx,
        });
    } catch (error) {
        console.error(error);
    } finally {
        setIsLoading(false);
        refetchActiveSigners();
    }
};

<ConnectButton
    client={client}
    theme={lightTheme()}
    accountAbstraction={{
        chain: sepolia,
        sponsorGas: true,
    }}
    wallets={[inAppWallet()]}
    connectButton={{
        label: "Sign In",
        style: {
            width: "100%",
            height: "40px",
            borderRadius: "8px",
        },
    }}
/>

<TransactionButton
transaction={() => prepareContractCall({
    contract: contract,
    method: "increment",
    params: [],
    })
}
onTransactionConfirmed={async () =>
alert("Incremented")
}
style={{
    width: "100%",
    backgroundColor: "#374151",
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: "0.375rem",
    transition: "background-color 0.2s",
    }}
>
Increment
</TransactionButton>

