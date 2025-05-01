import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import moment from 'moment';
import jwt from "jsonwebtoken";
import { envConfigs } from './envconfig';

export const generateAuthTokens = (userId:any) => {
  const accessTokenExpires= moment().add(
    envConfigs.expirationMinute,
    "minutes"
  );
  
  const accessToken = jwt.sign(JSON.stringify({
    userId: userId,
    type: "access", 
    exp: accessTokenExpires.unix() 
  }), envConfigs.jwtsecret);
  return accessToken;
}

const jwtOptions = {
  secretOrKey: envConfigs.jwtsecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload:any, done:any) => {
  try {
    if (payload.type !== "access") {
      throw new Error('Invalid token type');
    }
    done(null, payload);
  } catch (error) {
    done(error, false);
  }
};

export const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);