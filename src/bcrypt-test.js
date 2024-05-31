import bcrypt from "bcrypt";

const pw="123";

const hash=await bcrypt.hash(pw,8);

console.log({hash});

const hash2="$2b$08$OV2IQdiOM25R.RxCFS5swuhN4uCCCO81i7z7hm2A2kgepg/RBXkLq";

const result=await bcrypt.compare("13",hash2);

console.log({result});