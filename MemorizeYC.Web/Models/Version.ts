interface myVersion {
    version: string;
}

class myVersion implements myVersion{
    constructor() {
        this.version = GlobalVariables.version;
    }
}